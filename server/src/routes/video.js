import express from "express";
import { PrismaClient } from "@prisma/client";

import { protect, getAuthUser } from "../middleware/authorization";

const prisma = new PrismaClient();

function getVideoRoutes() {
  const router = express.Router();

  router.get("/", getRecommendedVideos);
  router.post("/", protect, addVideo);

  router.get("/trending", getTrendingVideos);
  router.get("/search", searchVideos);
  
  router.get("/:videoId", getAuthUser, getVideo);
  router.delete("/:videoId", protect, deleteVideo);
  
  router.get("/:videoId/views", getAuthUser, addVideoView);
  router.get("/:videoId/like", protect, likeVideo);
  router.get("/:videoId/dislike", protect, dislikeVideo);
  
  router.post("/:videoId/comments", protect, addComment);
  router.delete("/:videoId/comments/:commentId", protect, deleteComment);

  return router;
}

export async function getVideoViews(videos) {
  for (const video of videos) {
    const views = await prisma.view.count({
      where: {
        videoId: {
          equals: video.id,
        },
      },
    });

    video.views = views;
  }

  return videos;
}

async function getRecommendedVideos(req, res) {
  let videos = await prisma.video.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!videos.length) {
    return res.status(200).json({ videos });
  }

  videos = await getVideoViews(videos);

  res.status(200).json({ videos });
}

async function getTrendingVideos(req, res) {
  let videos = await prisma.video.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!videos.length) {
    return res.status(200).json({ videos });
  }

  videos = await getVideoViews(videos);
  videos.sort((a, b) => b.views - a.views);

  res.status(200).json({ videos });
}

async function searchVideos(req, res, next) {
  let videos = await prisma.video.findMany({
    include: {
      user: true,
    },
    where: {
      OR: [
        {
          title: {
            contains: req.query.query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: req.query.query,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  if (!videos.length) {
    return res.status(200).json({ videos });
  }

  videos = await getVideoViews(videos);
  videos.sort((a, b) => b.views - a.views);

  res.status(200).json({ videos });
}

async function addVideo(req, res) {
  const { title, description, url, thumbnail } = req.body;

  const videos = await prisma.video.create({
    data: {
      title,
      description,
      url,
      thumbnail,
      user: {
        connect: {
          id: req.user.id,
        },
      },
    },
  });

  res.status(200).json({ videos });
}

async function addComment(req, res, next) {
  const video = await prisma.video.findUnique({
    where: {
      id: req.params.videoId,
    },
  });

  if (!video)
    return res
      .status(400)
      .json({ message: `No found video id ${req.params.videoId}` });

  const comment = await prisma.comment.create({
    data: {
      text: req.body.text,
      user: {
        connect: {
          id: req.user.id,
        },
      },
      video: {
        connect: {
          id: req.params.videoId,
        },
      },
    },
  });

  res.status(200).json({ comment });
}

async function deleteComment(req, res) {
  const { videoId, commentId } = req.params;

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      userId: true,
    },
  });

  if (comment.userId !== req.user.id)
    return res
      .status(401)
      .json({ message: "You are not authorize to remove the comment!" });

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  res.status(200).json({});
}

async function addVideoView(req, res, next) {
  const { videoId } = req.params;
  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
  });

  if (!video)
    return next({
      message: `No found video id ${videoId}`,
      statusCode: 404,
    });

  if (req.user) {
    const view = await prisma.view.create({
      data: {
        video: {
          connect: {
            id: videoId,
          },
        },
        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });
  } else {
    const view = await prisma.view.create({
      data: {
        video: {
          connect: {
            id: videoId,
          },
        },
      },
    });
  }

  res.status(200).json({});
}

async function likeVideo(req, res, next) {
  const { videoId } = req.params;
  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
  });

  if (!video)
    return next({
      message: `No found video id ${videoId}`,
      statusCode: 404,
    });

  const isVideoLiked = await prisma.videoLike.findFirst({
    where: {
      userId: {
        equals: req.user.id,
      },
      videoId: {
        equals: videoId,
      },
      like: {
        equals: 1,
      },
    },
  });

  const isVideoDisliked = await prisma.videoLike.findFirst({
    where: {
      userId: {
        equals: req.user.id,
      },
      videoId: {
        equals: videoId,
      },
      like: {
        equals: -1,
      },
    },
  });

  if (isVideoLiked) {
    await prisma.videoLike.delete({
      where: {
        id: isVideoLiked.id,
      },
    });
  } else if (isVideoDisliked) {
    await prisma.videoLike.update({
      where: {
        id: isVideoDisliked.id,
      },
      data: {
        like: 1,
      },
    });
  } else {
    await prisma.videoLike.create({
      data: {
        user: {
          connect: {
            id: req.user.id,
          },
        },
        video: {
          connect: {
            id: videoId,
          },
        },
        like: 1,
      },
    });
  }

  res.status(200).json({});
}

async function dislikeVideo(req, res, next) {
  const { videoId } = req.params;
  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
  });

  if (!video)
    return next({
      message: `No found video id ${videoId}`,
      statusCode: 404,
    });

  const isVideoLiked = await prisma.videoLike.findFirst({
    where: {
      userId: {
        equals: req.user.id,
      },
      videoId: {
        equals: videoId,
      },
      like: {
        equals: 1,
      },
    },
  });

  const isVideoDisliked = await prisma.videoLike.findFirst({
    where: {
      userId: {
        equals: req.user.id,
      },
      videoId: {
        equals: videoId,
      },
      like: {
        equals: -1,
      },
    },
  });

  if (isVideoDisliked) {
    await prisma.videoLike.delete({
      where: {
        id: isVideoDisliked.id,
      },
    });
  } else if (isVideoLiked) {
    await prisma.videoLike.update({
      where: {
        id: isVideoLiked.id,
      },
      data: {
        like: -1,
      },
    });
  } else {
    await prisma.videoLike.create({
      data: {
        user: {
          connect: {
            id: req.user.id,
          },
        },
        video: {
          connect: {
            id: videoId,
          },
        },
        like: -1,
      },
    });
  }

  res.status(200).json({});
}

async function getVideo(req, res, next) {
  const { videoId } = req.params;
  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
    include: {
      user: true
    }
  });

  if (!video)
    return next({
      message: `No found video id ${videoId}`,
      statusCode: 404,
    });

  const comments = await prisma.comment.findMany({
    where: {
      videoId: {
        equals: videoId
      }  
    },
    include: {
      user: true
    }
  })

  let isLiked = false;
  let isDisliked = false;
  let isMine = false;
  let isViewed = false;
  let isSubscribed = false;

  if (req.user) {
    isMine = req.user.id === video.userId;

    isLiked = await prisma.videoLike.findFirst({
      where: {
        userId: {
          equals: req.user.id,
        },
        videoId: {
          equals: videoId,
        },
        like: {
          equals: 1,
        },
      },
    });

    isDisliked = await prisma.videoLike.findFirst({
      where: {
        userId: {
          equals: req.user.id,
        },
        videoId: {
          equals: videoId,
        },
        like: {
          equals: -1,
        },
      },
    });

    isViewed = await prisma.view.findFirst({
      where: {
        userId: {
          equals: req.user.id,
        },
        videoId: {
          equals: video.id,
        },
      },
    });

    isSubscribed = await prisma.subscription.findFirst({
      where: {
        subscriberId: {
          equals: req.user.id,
        },
        subscribedToId: {
          equals: video.userId,
        },
      },
    });
  }

  const commentsCount = await prisma.comment.count({
    where: {
      videoId: {
        equals: video.id,
      },
    },
  });

  const likesCount = await prisma.videoLike.count({
    where: {
      AND: {
        videoId: {
          equals: videoId,
        },
        like: {
          equals: 1,
        },
      },
    },
  });

  const dislikesCount = await prisma.videoLike.count({
    where: {
      AND: {
        videoId: {
          equals: videoId,
        },
        like: {
          equals: -1,
        },
      },
    },
  });

  const viewsCount = await prisma.view.count({
    where: {
      videoId: {
        equals: video.id,
      },
    },
  });

  const subscribersCount = await prisma.subscription.count({
    where: {
      subscribedToId: {
        equals: video.userId,
      },
    },
  });

  video.subscribersCount = subscribersCount;
  video.viewsCount = viewsCount;
  video.dislikesCount = dislikesCount;
  video.likesCount = likesCount;
  video.commentsCount = commentsCount;
  video.isMine = isMine;
  video.isLiked = Boolean(isLiked);
  video.isDisliked = Boolean(isDisliked);
  video.isViewed = Boolean(isViewed);
  video.isSubscribed = Boolean(isSubscribed);
  video.comments = comments;

  res.status(200).json({ video });
}

async function deleteVideo(req, res, next) {
  const { videoId } = req.params;
  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
    select: {
      userId: true,
    },
  });

  if (!video)
    return next({
      message: `No found video id ${videoId}`,
      statusCode: 404,
    });

  if (req.user.id !== video.userId)
    return next({
      message: `Your are not authorized to delete this video!`,
      statusCode: 401,
    });

  await prisma.comment.deleteMany({
    where: {
      videoId: {
        equals: videoId,
      },
    },
  });

  await prisma.videoLike.deleteMany({
    where: {
      videoId: {
        equals: videoId,
      },
    },
  });

  await prisma.view.deleteMany({
    where: {
      videoId: {
        equals: videoId,
      },
    },
  });

  await prisma.video.delete({
    where: {
      id: videoId,
    }
  });

  res.status(200).json({});
}

export { getVideoRoutes };
