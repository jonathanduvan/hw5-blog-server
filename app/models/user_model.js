
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

// create a schema for posts with a field
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
});


// Map _id to id
UserSchema.set('toJSON', {
  virtuals: true,
});

// Handle password hashing
UserSchema.pre('save', function beforeUserSave(next) {
  const user = this;

  // Ignore hashing if password not being modified
  if (!user.isModified('password')) return next();

  // generate salt with callback (async)
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      return next();
    });
  });
});

// Add password compare function
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
};

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
