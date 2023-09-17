const home = (req, res) => {
  res.status(200).json({
    success: true,
    greeting: "Hello From API",
  });
};

module.exports = {
  home,
};
