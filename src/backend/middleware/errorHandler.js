export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'PrismaClientKnownRequestError') {
    // Handle Prisma-specific errors
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'A record with this value already exists.' });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Record not found.' });
    }
  }

  res.status(500).json({ message: 'An unexpected error occurred.' });
};
