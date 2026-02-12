import AppLayout from "@/components/layout/AppLayout";
import RestaurantFinder from "@/components/Restaurants";
import React from "react";

const RestaurantsPage = () => {
  return (
    <AppLayout title="Restaurants" showMenuButton={true} locationIcon={false}>
      <RestaurantFinder />
    </AppLayout>
  );
};

export default RestaurantsPage;
