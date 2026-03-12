import { Box, Skeleton } from "@mui/material";

const UserFormSkeleton = () => {
  return (
    <Box className="p-4 border rounded-lg">
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {/* Full Name Field Skeleton */}
        <Box>
          <Skeleton variant="text" width={80} height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Box>

        {/* Email Field Skeleton */}
        <Box>
          <Skeleton variant="text" width={60} height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Box>

        {/* Phone Number Field Skeleton */}
        <Box>
          <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Box>

        {/* Additional Phone Number Fields Skeleton */}
        <Box>
          <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Box>

        <Box>
          <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Box>

        <Box>
          <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Box>

        <Box>
          <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Box>

        <Box>
          <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Box>

        <Box>
          <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Box>
      </Box>

      {/* Buttons Skeleton */}
      <Box className="flex items-center gap-3">
        <Skeleton variant="rectangular" width={80} height={40} />
        <Skeleton variant="rectangular" width={80} height={40} />
      </Box>
    </Box>
  );
};

export default UserFormSkeleton;
