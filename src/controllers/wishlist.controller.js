const bookModel = require('../models/Book');
const wishlistModel = require('../models/wishlist.model');

exports.addToWishlist = async (req, res) => {
    try {
        if (!req.user.id) {
            return res
                .status(401)
                .json({ status: 'FAIL', data: { message: 'You do not have permission to add to wishlist' } });
        }

        const { wishlistItems } = req.body;

        // Get the user's wishlist or create a new one if it doesn't exist
        let wishlist = await wishlistModel.findOne({ orderBy: req.user.id });

        if (!wishlist) {
            wishlist = new wishlistModel({
                orderBy: req.user.id,
                wishlistItems: [],
                totalQuantity: 0,
            });
        }

        // Iterate over each book in the request and add it to the wishlist
        for (const wishlistItemData of wishlistItems) {
            const bookId = wishlistItemData.bookId;

            // Check if the book is already in the wishlist
            const existingWishlistItem = wishlist.wishlistItems.find((item) => item.bookId.equals(bookId));

            if (!existingWishlistItem) {
                // If the book is not in the wishlist, retrieve book details
                const book = await bookModel.findById(bookId);

                if (!book) {
                    return res
                        .status(404)
                        .json({ status: 'FAIL', data: { message: `Book with ID ${bookId} not found` } });
                }

                // Add the book to the wishlist with a quantity of 1
                wishlist.wishlistItems.push({
                    bookId: book._id,
                });

                // Update wishlist totalQuantity
                wishlist.totalQuantity += 1; // Increment total quantity by 1 for each book
            }
        }

        // Save the updated wishlist
        await wishlist.save();

        res.status(200).json({
            status: 'SUCCESS',
            data: { message: 'Books added to wishlist successfully', wishlist },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'FAIL', data: { message: 'Internal Server Error' } });
    }
};

exports.getUserWishlist = async (req, res) => {
    try {
        // Find the user's cart and populate all details of the books
        const cart = await wishlistModel.findOne({ orderBy: req.user.id }).populate({
            path: 'wishlistItems.bookId',
            model: 'Book',
        });

        // Check if the cart exists
        if (!cart) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        res.status(200).json({ status: 'success', message: 'User Wishlist retrieved successfully', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.removeItemFromWishlist = async (req, res) => {
    try {
        if (!req.user.id) {
            return res
                .status(401)
                .json({ status: 'FAIL', data: { message: 'You do not have permission to remove from wishlist' } });
        }

        const { bookId } = req.params;

        // Find the user's wishlist
        const wishlist = await wishlistModel.findOne({ orderBy: req.user.id });

        if (!wishlist) {
            return res.status(404).json({ status: 'FAIL', data: { message: 'Wishlist not found for the user' } });
        }

        // Check if the bookId exists in the wishlist
        const existingItemIndex = wishlist.wishlistItems.findIndex((item) => item.bookId.equals(bookId));

        if (existingItemIndex === -1) {
            return res.status(404).json({ status: 'FAIL', data: { message: 'Book not found in the wishlist' } });
        }

        // Remove the item from the wishlist and decrease totalQuantity by one
        wishlist.wishlistItems.splice(existingItemIndex, 1);
        wishlist.totalQuantity = Math.max(0, wishlist.totalQuantity - 1);

        // Save the updated wishlist
        await wishlist.save();

        res.status(200).json({
            status: 'SUCCESS',
            data: { message: 'Book removed from wishlist successfully', wishlist },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'FAIL', data: { message: 'Internal Server Error' } });
    }
};

exports.clearWishlist = async (req, res) => {
    try {
        // Find the user's cart and delete it
        const deletedWishlist = await wishlistModel.deleteOne({ orderBy: req.user.id });

        // Check if the cart was deleted
        if (!deletedWishlist.deletedCount) {
            return res.status(404).json({ error: 'wishlist not found' });
        }

        res.status(200).json({ status: 'success', message: 'wishlist cleared successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
