const { ROLE } = require('../constant')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const { Schema } = mongoose

const userSchema = Schema({
  imageUrl: {
    type: String,
    default: function () { return gravatar.url(this.username, { s: '200', r: 'pg', d: 'mm' }, true) }
  },
  publisher: String,
  firstName: String,
  lastName: String,
  idCard: String,
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  address: String,
  road: String,
  subDistrict: String,
  district: String,
  province: String,
  postCode: String,
  bankAccount: String,
  idAccount: String,
  coin: {
    type: Number,
    require: true,
    default: 0
  },
  gender: String,
  roles: {
    type: [String],
    default: [ROLE.USER]
  },
  notifications: [{
    type: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
  }],
  requestHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  }],
  receiptBooks: [{
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    totalCost: Number,
    count: Number,
    createdAt: { type: Date, default: Date.now }
  }],
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
  inventory: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
  ratings: [{
    book: { type: Schema.Types.ObjectId, ref: 'Book' },
    rating: Number,
    comment: String
  }],
  processedReceipts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Receipt' }],
  processedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }],
  processedRequestsBook: [{ type: Schema.Types.ObjectId, ref: 'RequestBook' }],
  processedRequestsPayment: [{ type: Schema.Types.ObjectId, ref: 'RequestPayment' }],
  receiptHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Receipt'
  }],
  requestPaymentHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RequestPayment'
  }],
  requestBookHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RequestBook'
  }],
  historyCRUD: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HistoryCRUD'
  }],
  historyCRUDBook: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'historyCRUDBook'
  }],
  bookSell: [
    { type: Schema.Types.ObjectId, ref: 'Book' }
  ],
  createdAt: { type: Date, default: Date.now },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalSold: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  }
})

userSchema.pre('save', function (next) {
  const user = this

  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError)
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError)
          }

          user.password = hash
          next()
        })
      }
    })
  } else {
    return next()
  }
})

module.exports = mongoose.model('User', userSchema)
