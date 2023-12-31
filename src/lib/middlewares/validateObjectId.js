/* eslint-disable consistent-return */
import mongoose from 'mongoose';

const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid object ID',
    });
  }

  next();
};

export default validateObjectId;
