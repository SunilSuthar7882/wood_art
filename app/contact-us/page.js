"use client";
import React from "react";

import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  Input,
  FormLabel,
  TextField,
} from "@mui/material";
import HomePageHeader from "@/component/HomePageHeader";
import HomePageFooter from "@/component/HomePageFooter";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import contactHero from "@/public/images/contact-hero.webp";
import Image from "next/image";
import { useSnackbar } from "../contexts/SnackbarContext";
import CustomTextField from "@/component/CommonComponents/CustomTextField";

const contactMethods = [
  {
    icon: <Mail className="w-8 h-8 text-nutrition-green" />,
    title: "Email Us",
    description: "Get a response within 24 hours",
    contact: "info@macrosandmeals.com",
    action: "#",
    // action: "mailto:info@macrosandmeals.com",
  },
  {
    icon: <Phone className="w-8 h-8 text-nutrition-green" />,
    title: "Call Us",
    description: "Mon-Fri, 9AM-6PM EST",
    contact: "+1 (555) 123-4567",
    action: "tel:+15551234567",
  },
  {
    icon: <MapPin className="w-8 h-8 text-nutrition-green" />,
    title: "Visit Us",
    description: "Our headquarters",
    contact: "123 Wellness St, Health City, HC 12345",
    action: "#",
  },
];

const Contact = () => {
  const { toast } = useSnackbar();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const { name, email, subject, message } = formData;

  //   // Encode fields for URL
  //   const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=info@macrosaandmeals.com&cc=architsinghal@gmail.com&su=${encodeURIComponent(
  //     subject
  //   )}&body=${encodeURIComponent(
  //     `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  //   )}`;

  //   // Open Gmail in new tab
  //   window.open(mailtoLink, "_blank");
  // };

 const handleSubmit = (e) => {
  e.preventDefault();
  const { name, email, subject, message } = formData;

  // Prepares a mailto link (cross-client compatible)
  const mailtoLink = `mailto:info@macrosaandmeals.com?cc=architsinghal@gmail.com&subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  )}`;

  // Trigger default email client (user will choose Gmail/Outlook/Apple Mail, etc.)
  window.location.href = mailtoLink;
};


  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 w-full">
      <HomePageHeader />

      <div className="flex flex-col overflow-auto flex-1 ">
        <div className="flex flex-col max-w-[1400px] mx-auto p-4 w-full">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start w-full py-12 md:py-16 lg:py-20 gap-10 md:gap-16">
            {/* Text Section */}
            <div className="flex flex-col text-center md:text-left max-w-xl flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-green-600 mb-6">
                Get in Touch
              </h1>
              <p className="text-base sm:text-lg text-black leading-relaxed">
                Have questions about our nutrition plans or recipes? We’re here
                to help! Our team of registered dietitians and nutrition experts
                are ready to support your health journey.
              </p>
            </div>

            {/* Image Section */}
            <div className="relative w-full max-w-xl flex-1 aspect-[16/9] rounded-3xl shadow-2xl shadow-green-500/20 overflow-hidden group">
              <Image
                src={contactHero}
                alt="Contact our nutrition team"
                fill
                className="object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="py-20 ">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="section-title">Ways to Reach Us</h2>
                <p className="text-lg text-black max-w-2xl mx-auto">
                  Choose the method that works best for you. We&apos;re
                  committed to providing personalized support for your nutrition
                  journey.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {contactMethods.map((method, idx) => (
                  <Card
                    key={idx}
                    className="card card-hover p-6 flex flex-col items-center text-center"
                  >
                    <div className="flex justify-center mb-4 text-green-600 text-4xl">
                      {method.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-green-600 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-black mb-4">{method.description}</p>
                    <a
                      href={method.action}
                      className="text-green-600 hover:text-emerald-500 font-medium transition-colors"
                    >
                      {method.contact}
                    </a>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="py-20 bg-white relative border rounded-md">
            {/* Floating background effect */}
            <div className="absolute inset-0 "></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div>
                  <h2 className="section-title">Send Us a Message</h2>
                  <p className="text-lg text-black mb-8">
                    Fill out the form below and our nutrition experts will get
                    back to you within 24 hours with personalized guidance and
                    answers to your questions.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 rounded-full p-3 mt-1">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-600">
                          Quick Response
                        </h4>
                        <p className="text-black">
                          We typically respond within 2–4 hours during business
                          hours.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 rounded-full p-3 mt-1">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-600">
                          Expert Support
                        </h4>
                        <p className="text-black">
                          All responses come from certified nutritionists and
                          dietitians.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <Card className="card shadow-xl">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <FormLabel htmlFor="name">Full Name</FormLabel>
                          <CustomTextField
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <FormLabel htmlFor="email">Email Address</FormLabel>
                          <CustomTextField
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <FormLabel htmlFor="subject">Subject</FormLabel>
                        <CustomTextField
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <FormLabel htmlFor="message">Message</FormLabel>
                        <CustomTextField
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          className="mt-1 resize-none"
                          placeholder="Tell us about your nutrition goals, questions, or how we can help you..."
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        {/* Send Button */}

                        {/* Clear Button */}
                        <Button
                          type="button"
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-full shadow transition-transform transform hover:scale-105"
                          size="lg"
                          variant="contained" // can also use 'outlined' to be more MUI-ish
                          color="inherit"
                          onClick={() =>
                            setFormData({
                              name: "",
                              email: "",
                              subject: "",
                              message: "",
                            })
                          }
                        >
                          Clear
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-green-600 hover:bg-emerald-500 text-white font-medium rounded-full shadow-lg transition-transform transform hover:scale-105"
                          size="lg"
                          variant="contained"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <HomePageFooter />
      </div>
    </div>
  );
};

export default Contact;
