var db = require('./models');

db.user.create({
  firstName: 'Brian',
  lastName: 'Hague',
  email: 'bhague1281@gmail.com',
  password: 'test',
  admin: true
}).then(function(u) {
  console.log(u.get());
  u.createQuestion({
    content: 'A test question',
    answered: false,
    score: 0
  }).then(function(q) {
    console.log(q.get());
    db.comment.create({
      content: 'A test comment',
      score: 0,
      userId: u.id,
      questionId: q.id
    }).then(function(c) {
      console.log(c.get());
    });
  });
});