import User from '../models/user_model';
import jwt from 'jwt-simple';
import config from '../config';

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

export const signin = (req, res, next) => {
  res.json({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  // Check that there is an email and a password
  if (!email || !password || !username) {
    return res.status(422).send('You must provide email, password, and username.');
  }

  // Check if there exists a user with that email
  User.findOne({ email })
  .then(found => {
    if (!found) {
      console.log('user can be made');
      const user = new User();
      user.email = email;
      user.password = password;
      user.username = username;

      user.save()
        .then(result => {
          res.send({ token: tokenForUser(result) });
        })
        .catch(error => {
          res.json({ error: 'first one' });
        });
    } else {
      res.json('User already exists');
    }
  })
  .catch(error => {
    res.json({ error });
  });
};


export const getUsers = (req, res) => {
  User.find()
  .then(users => {
    // console.log(users);
    res.json(users);
  })
  .catch(error => {
    res.json({ error });
  });
};
