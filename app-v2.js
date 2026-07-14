const supplierData = Array.isArray(window.SUPPLIERS) ? window.SUPPLIERS : [];

const removeByName = name => {
  const index = supplierData.findIndex(item => item.name === name);
  if (index >= 0) supplierData.splice(index, 1);
};

removeByName("Gavino's Japanese Donuts");
removeByName('Wonderbake');

const allAboutBaking = supplierData.find(item => item.name === 'All About Baking');
if (allAboutBaking) {
  allAboutBaking.location = '52