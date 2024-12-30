const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        details: Object.values(err.errors).map(error => error.message)
      });
    }
  
    // Handle duplicate key errors (e.g., duplicate task_id)
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate task_id found'
      });
    }
  
    // Handle cast errors (e.g., invalid ObjectId)
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid ID format'
      });
    }
  
    // Default error
    res.status(500).json({
      message: 'Internal Server Error',
      // Only show error details in development
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  };
  
module.exports = errorHandler;