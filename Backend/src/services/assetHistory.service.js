const addAssetHistory = (asset, { event, user, userId, notes }) => {
  asset.history.push({
    date: new Date(),
    event,
    user,
    userId,
    notes: notes || '',
  });
};

module.exports = { addAssetHistory };
