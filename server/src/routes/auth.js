import express from "express";
// A function to get the routes.
// All route definitions are in one place and we only need to export one thing
import {PrismaClient} from '@prisma/client';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from "google-auth-library";

import { protect } from '../middleware/authorization';

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIET_ID);

function getAuthRoutes() {
  const router = express.Router();

  router.post('/google-login', googleLogin);
  router.get('/me', protect, me);
  router.get('/signout', signout);

  return router;
}

// All controllers/utility functions here
async function googleLogin(req, res) {
  //const { username, email } = req.body
  const { idToken } = req.body;
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIET_ID
  })

  const {name: username, picture: avatar, email} = ticket.getPayload();

  let user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if(!user) {
    user = await prisma.user.create({
      data: {
        username,
        email,
        avatar
      }
    });
  }

  const tokenPayload = {id: user.id}

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })

  res.cookie('token', token, { httpOnly: true });
  res.status(200).send(token);
}

async function me(req, res) {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      subscriberId: {
        equals: req.user.id
      }
    }
  })

  const channelsId = subscriptions.map(sub => sub.subscribedToId);

  const channels = await prisma.subscription.findMany({
    where: {
      id: {
        in: channelsId
      }
    }
  });

  const user = req.user;
  user.channels = channels

  res.status(200).send({ user })
}

function signout(req, res) {
  res.clearCookie('token');
  res.status(200).json({});
}

export { getAuthRoutes };
