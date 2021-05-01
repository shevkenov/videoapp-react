import express from "express";
import { PrismaClient } from "@prisma/client";

import { getAuthUser, protect } from "../middleware/authorization";
import { getVideoViews } from "./video";

const prisma = new PrismaClient();

function getUserRoutes() {
  const router = express.Router();

  router.get("/", protect, getRecommendedChannels);
  router.get("/liked-videos", protect, getLikedVideos);
  router.get("/history", protect, getHistory);
  router.get("/:userId/toggle-subscribe", protect, toggleSubscribe);
  router.get("/:userId", getAuthUser, getProfile);
  router.get("/subscriptions", protect, getFeed);
  router.get("/search", getAuthUser, searchUser);

  return router;
}

async function getVideos(model, req, res) {
  const videoRelation = await model.findMany({
    where: {
      userId: req.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let videoIds = videoRelation.map((video) => video.videoId);

  let videos = await prisma.video.findMany({
    where: {
      id: {
        in: videoIds,
      },
    },
    include: {
      user: true,
    },
  });

  if (!videos.length) return res.status(200).json({ videos });

  videos = await getVideoViews(videos);

  res.status(200).json({ videos });
}

async function getLikedVideos(req, res) {
  await getVideos(prisma.videoLike, req, res);
}

async function getHistory(req, res) {
  await getVideos(prisma.view, req, res);
}

async function toggleSubscribe(req, res, next) {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.userId,
    },
  });

  if (!user)
    return next({
      message: `The user with id: ${req.params.userId} does not exist!`,
      statusCode: 400,
    });

  const subscription = await prisma.subscription.findFirst({
    where: {
      subscriberId: {
        equals: req.user.id,
      },
      subscribedToId: {
        equals: req.params.userId,
      },
    },
  });

  if (subscription) {
    await prisma.subscription.delete({
      where: {
        id: subscription.id,
      },
    });
  } else {
    await prisma.subscription.create({
      data: {
        subscriber: {
          connect: {
            id: req.user.id,
          },
        },
        subscribedTo: {
          connect: {
            id: req.params.userId,
          },
        },
      },
    });
  }

  res.status(200).json({});
}

async function getFeed(req, res) {
  const subscribedTo = await prisma.subscription.findMany({
    where: {
      subscriberId: {
        equals: req.user.id,
      },
    },
  });

  const subscriptions = subscribedTo.map((sub) => sub.subscribedToId);

  const feeds = await prisma.video.findMany({
    where: {
      userId: {
        in: subscriptions,
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!feeds.length) return res.status(200).json({ feeds });

  const videos = await getVideoViews(feeds);

  res.status(200).json({ feed: videos });
}

async function searchUser(req, res, next) {
  if (!req.query.query)
    return next({
      message: "Please enter a search query",
      statusCode: 400,
    });

  let users = await prisma.user.findMany({
    where: {
      username: {
        contains: req.query.query,
        mode: "insensitive",
      },
    },
  });

  if (!users.length) return res.status(200).json({ users });

  for (const user of users) {
    const subscribersCount = await prisma.subscription.count({
      where: {
        subscribedToId: {
          equals: user.id,
        },
      },
    });

    const videosCount = await prisma.video.count({
      where: {
        userId: {
          equals: user.id,
        },
      },
    });

    let isMe = false;
    let isSubscribed = false;
    if (req.user) {
      isMe = req.user.id === user.id;

      const subscribtions = await prisma.subscription.findFirst({
        where: {
          AND: {
            subscriberId: {
              equals: req.user.id,
            },
            subscribedToId: {
              equals: user.id,
            },
          },
        },
      });

      isSubscribed = Boolean(subscribtions);
    }

    user.subscribersCount = subscribersCount;
    user.videosCount = videosCount;
    user.isMe = isMe;
    user.isSubscribed = isSubscribed;
  }

  users = users.sort((a, b) => b.subscribersCount - a.subscribersCount);

  res.status(200).json({ users });
}

async function getRecommendedChannels(req, res) {
  const channels = await prisma.user.findMany({
    where: {
      id: {
        not: req.user.id,
      },
    },
    take: 10,
  });

  for (const channel of channels) {
    const subscribersCount = await prisma.subscription.count({
      where: {
        subscribedToId: {
          equals: channel.id,
        },
      },
    });

    const videosCount = await prisma.video.count({
      where: {
        userId: {
          equals: channel.id,
        },
      },
    });

    
    const subscribedTo = await prisma.subscription.findFirst({
      where: {
        AND: {
          subscriberId: {
            equals: req.user.id,
          },
          subscribedToId: {
            equals: channel.id
          }
        },
      },
    });

    channel.isSubscribed = Boolean(subscribedTo);
    channel.videosCount = videosCount;
    channel.subscribersCount = subscribersCount
  }

  res.status(200).json({channels})
}

async function getProfile(req, res, next) {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.userId
    }
  })
}

async function editUser(req, res) {}

export { getUserRoutes };
