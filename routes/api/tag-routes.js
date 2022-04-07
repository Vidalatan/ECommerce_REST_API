const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({ include: Product })
    return res.status(200).json(tags)
  } catch (err) {
    return res.status(400).json(err)
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, { include: Product })
    return res.status(200).json(tag)
  } catch (err) {
    return res.status(400).json(err)
  }
});

router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body)
    return res.status(200).json(newTag)
  } catch (err) {
    return res.status(400).json(err)
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updTag = await Tag.update(req.body, {where: { id: req.params.id }})
    return res.status(200).json(updTag)
  } catch (err) {
    return res.status(400).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const delTag = await Tag.destroy({ where: { id: req.params.id }})
    return res.status(200).json(delTag)
  } catch (err) {
    return res.status(400).json(err)
  }
});

module.exports = router;
