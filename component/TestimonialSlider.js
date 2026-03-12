"use client";
import React, { useState } from "react";
import { Box, Typography, Avatar , Stack , Rating } from "@mui/material";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TestimonialSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
  {
    title: "Wellness Co.",
    name: "Samantha K.",
    description:
      "Macros and Meals has completely changed how I eat. The meals are delicious, healthy, and require zero prep. As a full-time working mom, it’s been the easiest way to stay on track with my nutrition.",
    image: "https://mui.com/static/images/avatar/1.jpg",
    rating: 5,
  },
  {
    title: "FitNation Gym",
    name: "Alice W.",
    description:
      "I’ve lost 8kg in just 3 months thanks to the customized meal plans and ongoing support. I don’t feel like I’m dieting—I’m just eating better. It’s sustainable and actually enjoyable!",
    image: "https://mui.com/static/images/avatar/2.jpg",
    rating: 4.8,
  },
  {
    title: "Peak Performance Coaching",
    name: "Travis H.",
    description:
      "The meal plans are so easy to follow, and I actually look forward to my meals. It takes all the guesswork out of eating healthy, and I feel more energized throughout the day.",
    image: "https://mui.com/static/images/avatar/5.jpg",
    rating: 4.7,
  },
  {
    title: "Elevate Wellness Studio",
    name: "Olivia M.",
    description:
      "I struggled with meal planning for years. This platform gave me structure, variety, and meals I love. My clothes fit better, my energy is up, and I’m finally consistent.",
    image: "https://mui.com/static/images/avatar/3.jpg",
    rating: 5,
  },
];


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    beforeChange: (_, next) => setCurrentSlide(next),
    customPaging: function (i) {
      return (
        <Box
          sx={{
            width: i === currentSlide ? "28px" : "26px",
            height: "8px",
            borderRadius: "6px",

            backgroundColor: i === currentSlide ? "#ffffff" : "#FFFFFF33",
            transition: "all 0.3s ease",
            mx: 0.5,
          }}
        />
      );
    },
    appendDots: (dots) => (
      <Box
        sx={{
          position: "absolute",
          bottom: "-50px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        <ul
          style={{
            display: "flex",
            justifyContent: "center",
            padding: 0,
            margin: 0,
          }}
        >
          {dots}
        </ul>
      </Box>
    ),
  };

  return (
    <Box width="100%" overflow="hidden" position="relative" p={2} pb={6}>
      {/* <Avatar src="/avatar4.jpg" sx={{ width: 256, height: 256, mb: 2 }} /> */}
      <Slider {...settings}>
        {testimonials.map((item, index) => (
          <Box
            key={index}
            sx={{
              background: "linear-gradient(135deg, #196a4d, #1a6a4d)",
              borderRadius: "20px",
              p: 3,
              color: "#f1f5f4",
              minHeight: "220px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            <Box mb={2}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#ffffff", mb: 1 }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "#d1e7dd",
                }}
              >
                {item.description}
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center" 
              mt={2}
            >
              <Box display="flex" alignItems="center" gap={2}>
              <Stack direction="row" spacing={2}>
                  <Avatar
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: "#D9D9D9",
                      objectFit: "cover",
                      objectPosition: "center",
                      border: "1px solid #D9D9D9",
                    }}
                  />
                <Typography variant="subtitle2" fontWeight="bold">
                  {item.name}
                </Typography>
                </Stack>
              </Box>
              <Rating
                value={item.rating}
                readOnly
                precision={0.5}
                size="small"
                sx={{
                  color: "#ffc107",
                }}
              />                 
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default TestimonialSlider;