const mongoose = require("mongoose");
const Requests = require("../Models/Requests");
const Ride = require("../Models/Ride");
const User = require("../Models/User");

function isObjectId(value) {
  return (
    mongoose.Types.ObjectId.isValid(value) &&
    String(value) === String(new mongoose.Types.ObjectId(value))
  );
}

async function resolveUser(identifier) {
  if (!identifier) {
    return null;
  }

  if (isObjectId(identifier)) {
    const userById = await User.findById(identifier);
    if (userById) {
      return userById;
    }
  }

  return User.findOne({ email: identifier.toLowerCase() });
}

async function createNewRequests(req, res) {
  try {
    const newRequest = await Requests.create(req.body);
    if (!newRequest) {
      return res.status(404).json({ message: "Request not created" });
    }
    return res.status(201).json({
      message: "Request Created Successfully",
      newRequest: newRequest,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getAllRequests(req, res) {
  try {
    const allRequests = await Requests.find().populate("ride_detail");
    if (!allRequests) {
      return res.status(404).json({ message: "Request not created" });
    }
    return res.status(200).json({ requests: allRequests });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteRequestsByRideId(req, res) {
  try {
    const rideIdentifier = req.params.rideId;
    let ride = null;

    if (isObjectId(rideIdentifier)) {
      ride = await Ride.findById(rideIdentifier).select("_id");
    }

    if (!ride) {
      ride = await Ride.findOne({ rideId: rideIdentifier }).select("_id");
    }

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const deletedRequests = await Requests.deleteMany({ ride_detail: ride._id });

    if (deletedRequests.deletedCount === 0) {
      return res.status(404).json({ message: "No requests found for this ride" });
    }
    return res.status(200).json({
      message: "Requests deleted successfully",
      deletedRequestsCount: deletedRequests.deletedCount,
      rideId: ride._id,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getBookingsByUser(req, res) {
  try {
    const user = await resolveUser(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookings = await Requests.find({
      booked_by: user.email.toLowerCase(),
    })
      .populate({
        path: "ride_detail",
        populate: {
          path: "posted_person_email",
          select: "email firstName lastName role",
        },
      })
      .sort({ _id: -1 });

    return res.status(200).json({ bookings, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getRequestQueueByUser(req, res) {
  try {
    const user = await resolveUser(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ridesPostedByUser = await Ride.find({
      posted_person_email: user._id,
    }).select("_id");
    const rideIds = ridesPostedByUser.map((ride) => ride._id);

    const requests = await Requests.find({
      ride_detail: { $in: rideIds },
      status: "pending",
    })
      .populate({
        path: "ride_detail",
        populate: {
          path: "posted_person_email",
          select: "email firstName lastName role",
        },
      })
      .sort({ _id: -1 });

    return res.status(200).json({ requests, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getRequest(req, res) {
  try {
    const requestId = req.params.id;
    const request = await Requests.findById(requestId).populate("ride_detail");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.status(200).json({ request });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateRequest(req, res) {
  try {
    const requestId = req.params.id;
    const updatedRequest = await Requests.findByIdAndUpdate(
      requestId,
      { $set: req.body },
      { new: true, runValidators: true },
    ).populate("ride_detail");

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not updated" });
    }

    return res.status(200).json({
      message: "Request updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteRequest(req, res) {
  try {
    const requestId = req.params.id;
    const deletedRequest = await Requests.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not deleted" });
    }

    return res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createNewRequests,
  getAllRequests,
  getBookingsByUser,
  getRequestQueueByUser,
  getRequest,
  updateRequest,
  deleteRequest,
  deleteRequestsByRideId
};
