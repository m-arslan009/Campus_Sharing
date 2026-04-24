const mongoose = require("mongoose");
const Ride = require("../Models/Ride");
const Requests = require("../Models/Requests");

async function createNewRide(req, res) {
  try {
    const postedPersonId = req.body?.posted_person_email;

    if (!mongoose.Types.ObjectId.isValid(postedPersonId)) {
      return res
        .status(400)
        .json({ message: "posted_person_email must be a valid user id" });
    }

    const newRide = await Ride.create(req.body);
    const populatedRide = await Ride.findById(newRide._id).populate(
      "posted_person_email",
      "email firstName lastName username"
    );

    return res
      .status(201)
      .json({ message: "Ride successfully Created", ride: populatedRide });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getAllRides(req, res) {
  try {
    const rides = await Ride.find().populate(
      "posted_person_email",
      "email firstName lastName username",
    );
    return res.status(200).json({ allRides: rides });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getRide(req, res) {
  try {
    const rideIdentifier = req.params.id;
    let ride = null;

    if (mongoose.Types.ObjectId.isValid(rideIdentifier)) {
      ride = await Ride.findById(rideIdentifier).populate(
        "posted_person_email",
        "email firstName lastName username",
      );
    }

    if (!ride) {
      ride = await Ride.findOne({ rideId: rideIdentifier }).populate(
        "posted_person_email",
        "email firstName lastName username",
      );
    }

    if (!ride) {
      return res.status(404).json({ message: `Ride not found` });
    }

    return res.status(200).json({ ride });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteRide(req, res) {
  try {
    if (req.user?.role !== "organizer") {
      return res.status(403).json({ message: "Only organizers can delete rides" });
    }

    const rideIdentifier = req.params.id;
    let deletedRide = null;

    if (mongoose.Types.ObjectId.isValid(rideIdentifier)) {
      deletedRide = await Ride.findByIdAndDelete(rideIdentifier);
    }

    if (!deletedRide) {
      deletedRide = await Ride.findOneAndDelete({ rideId: rideIdentifier });
    }

    if (!deletedRide) {
      return res
        .status(404)
        .json({ message: `Something is wrong. Ride not deleted` });
    }

    // Hard guarantee cascade from controller in addition to model middleware.
    const deletedRequests = await Requests.deleteMany({
      ride_detail: deletedRide._id,
    });

    return res.status(200).json({
      message: "Ride successfully Deleted",
      rideId: deletedRide._id,
      deletedRequestsCount: deletedRequests.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateRide(req, res) {
  try {
    const rideIdentifier = req.params.id;
    let filter = { rideId: rideIdentifier };

    if (mongoose.Types.ObjectId.isValid(rideIdentifier)) {
      filter = { _id: rideIdentifier };
    }

    const updatedRide = await Ride.findOneAndUpdate(filter, {
      $set: req.body,
    }, {
      new: true,
      runValidators: true,
    }).populate(
      "posted_person_email",
      "email firstName lastName username",
    );

    if (!updatedRide) {
      return res
        .status(404)
        .json({ message: `Something is wrong. Ride not updated` });
    }

    return res
      .status(200)
      .json({ message: "Ride successfully updated", ride: updatedRide });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createNewRide,
  getAllRides,
  getRide,
  deleteRide,
  updateRide,
};
