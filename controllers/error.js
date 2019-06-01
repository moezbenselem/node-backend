exports.get404 = (req, res, next) => {
  
  const isLoggedIn = req.session.isLoggedIn;
  let user;
  if (isLoggedIn)
    user = 'admin';
  else
    user = 'public';

  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404',user:user});
};
