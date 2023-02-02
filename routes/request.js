const express = require('express')
const router = express.Router()
const Request = require('../models/Request')
const User = require('../models/User')

const request = async function (req, res, next) {
  const user = req.body.user
  const request = req.body.request
  const publisher = req.body.publisher
  const firstName = req.body.fistName
  const lastName = req.body.lastName
  const idCard = req.body.idCard
  const phone = req.body.phone
  const address = req.body.address
  const road = req.body.road
  const subDistrict = req.body.subDistrict
  const district = req.body.district
  const postCode = req.body.postCode
  const province = req.body.province
  const bankAccount = req.body.bankAccount
  const idAccount = req.body.idAccount

  const newRequest = new Request({
    user,
    request,
    publisher,
    firstName,
    lastName,
    idCard,
    phone,
    address,
    road,
    subDistrict,
    district,
    province,
    postCode,
    bankAccount,
    idAccount
  })

  try {
    const findUser = await User.findById(newRequest.user)
    findUser.requestHistory.push(newRequest)
    await newRequest.save()
    await findUser.save()

    res.status(201).json({
      findUser
    })
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

const getRequests = async function (req, res, next) {
  try {
    const requests = await Request.find({ status: 'pending' })
    res.send({ requests })
  } catch (error) {
    res.status(500).send(error)
  }
}

const getRequest = async function (req, res, next) {
  const id = req.params.id
  try {
    const request = await Request.findById(id)
    res.send({ request })
  } catch (error) {
    res.status(500).send(error)
  }
}

const approveRequest = async function (req, res, next) {
  const id = req.params.id
  try {
    const request = await Request.findById(id)
    if (!request) return res.status(404).send('Request not found')
    request.status = 'approved'
    await request.save()
    const user = await User.findById(request.user)
    user.roles.push('SELL')
    user.publisher = request.publisher
    user.firstName = request.firstName
    user.lastName = request.lastName
    user.idCard = request.idCard
    user.phone = request.phone
    user.address = request.address
    user.road = request.road
    user.subDistrict = request.subDistrict
    user.district = request.district
    user.province = request.province
    user.postCode = request.postCode
    user.bankAccount = request.bankAccount
    user.idAccount = request.idAccount
    await user.save()
    res.send({ request, user })
  } catch (error) {

  }
}

const rejectRequest = async function (req, res, next) {
  const id = req.params.id
  try {
    const request = await Request.findById(id)
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
router.post('/', request)
router.patch('/:id/approve', approveRequest)
router.patch('/:id/reject', rejectRequest)
module.exports = router
