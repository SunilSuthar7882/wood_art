"use client";
import dayjs from "dayjs";
import {
  Activity,
  AlertCircle,
  ArrowUp,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  List,
  Target,
  User,
  Utensils,
} from "lucide-react";
import React from "react";

const MealPlanDetails = ({ data }) => {
  // Format date using dayjs
  const formatDate = (dateString) => {
    return dayjs(dateString).format("MMM D, YYYY • h:mm A");
  };

  // Format time using dayjs
  const formatTime = (timeString) => {
    if (!timeString) return "Not specified";
    return dayjs(`2000-01-01 ${timeString}`).format("h:mm A");
  };

  const StatusBadge = ({ status }) => {
    let bgColor = "";
    let textColor = "";

    switch (status) {
      case "in_progress":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        break;
      case "completed":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        break;
      case "pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor} capitalize`}
      >
        {status?.replace("_", " ")}
      </span>
    );
  };

  // InfoCard component for reusable sections
  const InfoCard = ({ title, icon, children, className }) => (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center mb-4 gap-2">
        <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );

  // Info item component
  const InfoItem = ({ label, value, icon }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {icon && <span className="mr-2 text-gray-500">{icon}</span>}
        <span className="text-gray-500 min-w-32">{label}:</span>
      </div>

      <span className="ml-2 font-medium text-gray-800">
        {value || "Not specified"}
      </span>
    </div>
  );

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Meal Plan Request #{data?.id}
            </h1>
            <StatusBadge status={data?.status} />
          </div>

          <div className="flex items-center text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm">
              Created: {formatDate(data?.createdAt)}
            </span>
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">
              Last Updated: {formatDate(data?.updatedAt)}
            </span>
          </div>

          {data?.customer && (
            <div className="flex items-center text-gray-600">
              <User className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                {data?.customer?.full_name}
              </span>
              <span className="mx-2">•</span>
              <span className="text-sm">{data?.customer?.email}</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <InfoCard
            title="Personal Information"
            icon={<User className="h-5 w-5 text-green-500" />}
          >
            <InfoItem label="Age" value={`${data?.age || ""} years`} />
            <InfoItem label="Height" value={`${data?.height || ""} cm`} />
            <InfoItem
              label="Current Weight"
              value={`${data?.weight || ""} kg`}
            />
            <InfoItem
              label="Target Weight"
              value={`${data?.target_weight || ""} kg`}
            />
            <InfoItem
              label="Activity Level"
              value={data?.activity_level || ""}
              icon={<Activity className="h-4 w-4" />}
            />
          </InfoCard>

          {/* Diet Preferences */}
          <InfoCard
            title="Diet Preferences"
            icon={<Utensils className="h-5 w-5 text-green-500" />}
          >
            <InfoItem label="Diet Type" value={data?.diet_type} />
            <InfoItem
              label="Preferred Cuisine"
              value={data?.preferred_cuisine || "No preference"}
            />
            <InfoItem
              label="Meals Per Day"
              value={data?.number_of_meals_preferred}
              icon={<List className="h-4 w-4" />}
            />
            <InfoItem
              label="Wake-up Time"
              value={formatTime(data?.wake_up_time)}
              icon={<Clock className="h-4 w-4" />}
            />
            <InfoItem
              label="Sleep Time"
              value={formatTime(data?.sleep_time)}
              icon={<Clock className="h-4 w-4" />}
            />
            <InfoItem
              label="Meal Timing"
              value={data?.meal_timing_preferences || "No specific preferences"}
            />
          </InfoCard>

          {/* Goals and Allergies */}
          <InfoCard
            title="Goals & Health Information"
            icon={<Target className="h-5 w-5 text-green-500" />}
            className="md:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  Goals
                </h4>
                {data?.goals?.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700 pl-2">
                    {data?.goals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No specific goals mentioned</p>
                )}

                <h4 className="text-gray-700 font-medium mt-4 mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Loved Foods
                </h4>
                {data?.liked_foods?.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700 pl-2">
                    {data?.liked_foods.map((food, index) => (
                      <li key={index}>{food?.food?.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No preferred foods specified</p>
                )}
              </div>

              <div>
                <h4 className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  Allergies
                </h4>
                {data?.any_allergies ? (
                  data?.allergies?.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-700 pl-2">
                      {data?.allergies.map((allergy, index) => (
                        <li key={index}>{allergy}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      No specific allergies listed
                    </p>
                  )
                ) : (
                  <p className="text-gray-700 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    No allergies reported
                  </p>
                )}

                <h4 className="text-gray-700 font-medium mt-4 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Avoided Foods
                </h4>
                {data?.avoided_foods?.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700 pl-2">
                    {data?.avoided_foods.map((food, index) => (
                      <li key={index}>{food?.food?.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No avoided foods specified</p>
                )}
              </div>
            </div>
          </InfoCard>

          {/* Additional Notes */}
          {data?.note && (
            <InfoCard
              title="Additional Notes"
              icon={<List className="h-5 w-5 text-green-500" />}
              className="md:col-span-2"
            >
              <p className="text-gray-700">{data?.note}</p>
            </InfoCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanDetails;
