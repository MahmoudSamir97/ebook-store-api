const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        bookTitle: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, 'Too short book title'],
            maxlength: [150, 'Too long book title'],
        },
        bookPrice: {
            type: Number,
            required: [true, 'book price is required'],
            trim: true,
        },
        Author: {
            type: String,
           required: [true, 'Author Name is required'],
            trim: true,
        },
        bookDescription:{
            type:String,
            trim:true
        },
        bookPdf: {
            secure_url:String,
            public_id: String,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            // required: [true]
        },
        publisherName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Publisher',
            // required: [true, 'Publisher name is required'],
        },
        averageRating: {
            type: Number,
            default: 0,
          },
          numOfReviews: {
            type: Number,
            default: 0,
          },
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            // required: true,
          },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// If I want to search single product, in tha product I also want to have all reviews associated with that product.
bookSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "book",
    justOne: false,
  })

  bookSchema.pre("remove", async function (next) {
    // Go to 'Reveiw; and delete all the review that are associated with this particular product
    await this.model("Review").deleteMany({ book: this._id })
  })
const bookModel = mongoose.model('Book', bookSchema);

module.exports = bookModel;
