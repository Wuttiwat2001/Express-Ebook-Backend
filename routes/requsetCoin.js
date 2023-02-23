const express = require('express')
const router = express.Router()
const Receipt = require('../models/Receipt')
const User = require('../models/User')

const getRequests = async function (req, res, next) {
  try {
    const receipt = await Receipt.find({ status: 'pending' })
    res.send({ receipt })
  } catch (error) {
    res.status(500).send(error)
  }
}

const getRequest = async function (req, res, next) {
  const id = req.params.id
  try {
    const request = await Receipt.findById(id)
    res.send({ request })
  } catch (error) {
    res.status(500).send(error)
  }
}

const approveRequest = async function (req, res, next) {
  const id = req.params.id
  try {
    const request = await Receipt.findById(id)
    if (!request) return res.status(404).send('Request not found')
    request.status = 'approved'
    await request.save()
    const user = await User.findById(request.user)
    user.coin += request.amount
    await user.save()
    res.send({ request, user })
  } catch (error) {

  }
}

const rejectRequest = async function (req, res, next) {
  const id = req.params.id
  try {
    const request = await Receipt.findById(id)
    if (!request) return res.status(404).send('Request not found')
    request.status = 'rejected'
    await request.save()
    res.send({ request })
  } catch (error) {
    res.status(500).send(error)
  }
}

router.get('/', getRequests)
router.get('/:id', getRequest)
router.patch('/:id/approve', approveRequest)
router.patch('/:id/reject', rejectRequest)
module.exports = router
