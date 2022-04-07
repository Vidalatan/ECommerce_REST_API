const router = require('express').Router();
const { del } = require('express/lib/application');
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

router.get('/', async (req, res) => {
  try {
    const allProducts = await Product.findAll({ include: [Category, Tag] })
    return res.status(200).json(allProducts)
  } catch (err) {
    return res.status(400).json(err)
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const allProducts = await Product.findByPk( req.params.id, { include: [Category, Tag] })
    return res.status(200).json(allProducts)
  } catch (err) {
    return res.status(400).json(err)
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    var productTagIds;
    const newProduct = await Product.create(req.body)
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return { product_id: newProduct.id, tag_id };
      });
      productTagIds = await ProductTag.bulkCreate(productTagIdArr);
    } else {
      // if no product tags, just respond
      res.status(200).json(newProduct);
    }
    res.status(200).json(productTagIds)
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, { where: { id: req.params.id }})
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id }})
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    const newProductTags = req.body.tagIds
    .filter((tag_id) => !productTagIds.includes(tag_id))
    .map((tag_id) => { return { product_id: req.params.id, tag_id }})
    const productTagsToRemove = productTags
    .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
    .map(({ id }) => id);
    const updatedProductTags = await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove }}),
      ProductTag.bulkCreate(newProductTags)
    ])
    return res.status(200).json(updatedProductTags)
  } catch (err) {
    console.error(err);
    return res.status(400).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const delProduct = await Product.destroy({ where: { id: req.params.id }})
    return res.status(200).json(delProduct)
  } catch (err) {
    return res.status(400).json(err)
  }
});

module.exports = router;
