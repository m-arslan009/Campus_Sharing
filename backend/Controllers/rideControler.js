const Ride = require("../Models/Ride");

async function createNewRide(req, res) {
  try {
    const newRide = await Ride.create(req.body);
    const populatedRide = await Ride.findById(newRide._id).populate(
      "posted_person_email",
      "email",
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
    const rides = await Ride.find().populate("posted_person_email", "email");
    return res.status(200).json({ allRides: rides });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getRide(req, res) {
  try {
    const rideId = req.params.id;
    const ride = await Ride.findById(rideId).populate(
      "posted_person_email",
      "email",
    );
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
    const rideId = req.params.id;
    const deletedRide = await Ride.findByIdAndDelete(rideId);
    if (!deletedRide) {
      return res
        .status(404)
        .json({ message: `Something is wrong. Ride not deleted` });
    }

    return res.status(200).json({ message: "Ride successfully Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateRide(req, res) {
  try {
    const rideId = req.params.id;
    const updatedRide = await Ride.findOneAndUpdate(
      { _id: rideId },
      { $set: req.body },
      { new: true, runValidators: true },
    ).populate("posted_person_email", "email");
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
