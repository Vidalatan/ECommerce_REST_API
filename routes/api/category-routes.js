const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const allCategories = await Category.findAll( {include: Product} )
    return res.status(200).json(allCategories);
  } catch (err) {
    return res.status(400).json(err)
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.id },
      include: Product
    })
    return res.status(200).json(category)
  } catch (err) {
    return res.status(400).json(err)
  }
});

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body)
    return res.status(200).json(newCategory)
  } catch (err) {
    return res.status(400).json(err)
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updCategory = await Category.update(req.body, { where: { id: req.params.id }})
    return res.status(200).json(updCategory)
  } catch (err) {
    return res.status(400).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const delCategory = await Category.destroy({where : { id: req.params.id }})
    return res.status(200).json(delCategory)
  } catch (err) {
    return res.status(400).json(err)
  }
});

module.exports = router;
