const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');


const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    // index: true,
    maxlength: [40, 'A tour must have less than or equals to 40 Characters'],
    minlength: [10, 'A tour must have more than or equals to 10 Characters'],
    // validate: [validator.isAlpha, 'Tour name must only contain characters'],
  },
  slug: String,
  duration: { type: Number, required: [true, 'A tour must have a duration'] },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above or equals to 1.0'],
    max: [5, 'Rating must be below or equals to 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        // this only points to current doc on new document creation
        return val < this.price;
      },
      message: !this.validate ? 'Discount price ({VALUE}) must be less than price' : "",

    },

  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function(doc, next){
//   console.log(doc);
//   next();
// })

//QUERY MIDDLEWARE
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
})

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
})

//AGGRIGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  console.log(this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }));
  next();
})
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
