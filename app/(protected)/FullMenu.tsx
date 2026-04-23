import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal } from "react-native";
import Header from "../../components/layout/Header";
import { FontAwesome5, Feather, Ionicons } from "@expo/vector-icons";

import SkeletonCard from "@/components/SkeletonCard";
import ProductCarousel from "../../components/ProductCarousel";
import Filters from "../../components/Filters";
import ViewDish from "../../components/dashboard/ViewDish";

import { useOrder } from "../../hooks/useOrder";
import { getMenuItems } from "../../services/menuService";
import type { PropType } from "../../types";
import { useRestaurant } from "../../contexts/RestaurantContext";

const ITEMS_PER_PAGE = 12;

const FullMenu: React.FC = () => {
  const { selectedRestaurant } = useRestaurant();
  const restaurantName = selectedRestaurant?.name || "Gram Bistro";
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    if (search === "") {
      setDebouncedSearch("");
    } else {
      const handler = setTimeout(() => {
        setDebouncedSearch(search);
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [search]);

  // Loading state for menu items
  const [loading, setLoading] = useState(true);

  // for the filter component
  const [filterButton, setFilterButton] = useState(false);

  // Main Category State
  const [mainCategory, setMainCategory] = useState<"Eat" | "Drink" | "Dessert">("Eat");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // All menu items from Supabase
  const [allItems, setAllItems] = useState<(PropType & { category: string })[]>([]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        const items = await getMenuItems();
        setAllItems(items);
      } catch (error) {
        console.error("Failed to fetch menu items", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  // Applied filters state
  const [appliedFilters, setAppliedFilters] = useState<{
    productTypes: string[];
    ratings: number[];
    priceRange: [number, number];
  }>({ productTypes: [], ratings: [], priceRange: [0, 30] });

  // Reset to page 1 whenever filters, search, or category change
  useEffect(() => {
    setCurrentPage(1);
  }, [mainCategory, debouncedSearch, appliedFilters]);

  // Filter dishes based on selected tag, search input, and applied filters
  const filteredDishes = useMemo(() => {
    let dishes = allItems.filter((item) => item.category === mainCategory);

    if (debouncedSearch.trim() !== "") {
      dishes = dishes.filter((dish) =>
        dish.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    }

    // Apply product type filters
    if (appliedFilters.productTypes.length > 0) {
      dishes = dishes.filter(
        (dish) =>
          dish.tag &&
          dish.tag.some((tag) =>
            appliedFilters.productTypes.some(
              (pt) => pt.toLowerCase() === tag.toLowerCase(),
            ),
          ),
      );
    }

    if (appliedFilters.ratings.length > 0) {
      dishes = dishes.filter((dish) =>
        appliedFilters.ratings.includes(Math.floor(dish.rating)),
      );
    }
    dishes = dishes.filter(
      (dish) =>
        dish.price >= appliedFilters.priceRange[0] &&
        dish.price <= appliedFilters.priceRange[1],
    );
    return dishes;
  }, [mainCategory, debouncedSearch, appliedFilters, allItems]);

  // Pagination derived values
  const totalPages = Math.max(1, Math.ceil(filteredDishes.length / ITEMS_PER_PAGE));
  const paginatedDishes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDishes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDishes, currentPage]);

  const { selectedItem, setSelectedItem, showOrder, addToOrder } = useOrder();

  const scrollViewRef = useRef<ScrollView>(null);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    scrollViewRef.current?.scrollTo({ y: 300, animated: true });
  };

  return (
    <View className="flex-1 bg-white dark:bg-(--neutral-900)">
      <Header
        title={restaurantName}
        backButton={true}
        showSideBar={false}
      />

      <ScrollView ref={scrollViewRef} className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="pt-6 md:pt-12 w-full">
          <View className="px-6 py-4 md:py-8">
            <View className="px-2 py-2 md:p-4 rounded-2xl md:shadow-sm bg-white dark:bg-[#4A4A6A] flex-row justify-between items-center">
              <View className="flex-1 flex-row items-center px-4 py-3 rounded-2xl border border-neutral-200 bg-transparent dark:border-neutral-600">
                <TextInput
                  className="flex-1 text-base text-neutral-500 dark:text-neutral-200"
                  placeholderTextColor="#737373"
                  placeholder="Search"
                  value={search}
                  onChangeText={setSearch}
                />
                <Feather name="search" size={20} color="#a3a3a3" />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setFilterButton(!filterButton)}
                className="ml-4 flex-row items-center justify-between py-4 px-4 rounded-2xl bg-[#32324D] dark:bg-purple-600"
              >
                <FontAwesome5 name="filter" size={16} color="white" />
                <Text className="hidden md:flex text-white ml-2 text-sm lg:text-base font-medium">
                  Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* carousel section */}
          <ProductCarousel />

          {/* Main Category Buttons */}
          <View className="px-6 py-2 mb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
              {(["Eat", "Drink", "Dessert"] as const).map((category) => (
                <TouchableOpacity
                  key={category}
                  activeOpacity={0.8}
                  onPress={() => setMainCategory(category)}
                  className={`flex-row items-center justify-center rounded-2xl px-6 py-3 border ${
                    mainCategory === category
                      ? "bg-yellow-400 border-yellow-400"
                      : "bg-transparent border-neutral-200 dark:border-neutral-600"
                  }`}
                >
                  <Text
                    className={`text-lg ${
                      mainCategory === category
                        ? "text-black font-bold"
                        : "text-neutral-600 dark:text-neutral-100 font-medium"
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* product/dishes listing section */}
          <View className="px-6 py-4 flex-col gap-6">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg text-neutral-600 dark:text-neutral-200 font-semibold">
                {mainCategory}
              </Text>
              {!loading && filteredDishes.length > 0 && (
                <Text className="text-sm font-medium text-neutral-400">
                  {filteredDishes.length} dish{filteredDishes.length !== 1 ? "es" : ""}
                </Text>
              )}
            </View>

            {loading ? (
              <View className="flex-row flex-wrap justify-between gap-y-6">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <View
                    key={index}
                    className="w-[48%] bg-white dark:bg-neutral-800 py-3 px-4 rounded-2xl shadow-sm flex-col items-center"
                  >
                    <SkeletonCard variant="vertical" />
                  </View>
                ))}
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-between gap-y-6">
                {paginatedDishes.map((dish) => (
                  <TouchableOpacity
                    key={dish.id}
                    activeOpacity={0.8}
                    className="w-[48%] bg-white dark:bg-neutral-800 py-4 px-4 rounded-2xl shadow-sm flex-col items-center relative"
                    onPress={() => setSelectedItem(dish)}
                  >
                    <View className="rounded-full mb-3 w-24 h-24 overflow-hidden">
                      <Image
                        source={{ uri: dish.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>

                    <Text className="text-base text-center font-semibold text-neutral-800 dark:text-white mb-2">
                      {dish.name}
                    </Text>

                    <View className="flex-row items-center absolute top-2 right-2 bg-white/90 dark:bg-neutral-700/90 rounded-xl px-1.5 py-0.5 shadow-sm">
                      {dish.rating < 4.5 ? (
                        <Ionicons name="star-half" size={12} color="#F59E0B" />
                      ) : (
                        <Ionicons name="star" size={12} color="#F59E0B" />
                      )}
                      <Text className="text-xs font-medium ml-1 text-neutral-800 dark:text-white">
                        {dish.rating.toFixed(1)}
                      </Text>
                    </View>

                    <Text className="text-orange-500 text-lg font-extrabold mt-auto">
                      ${dish.price.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <View className="flex-row items-center justify-center gap-2 pt-6 pb-4">
                {/* Previous arrow */}
                <TouchableOpacity
                  onPress={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-600 ${
                    currentPage === 1 ? "opacity-40" : ""
                  }`}
                >
                  <Ionicons name="chevron-back" size={16} color="#52525b" />
                </TouchableOpacity>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <TouchableOpacity
                    key={page}
                    onPress={() => goToPage(page)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${
                      currentPage === page
                        ? "bg-purple-600 border-purple-600"
                        : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-600"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        currentPage === page
                          ? "text-white"
                          : "text-neutral-600 dark:text-neutral-200"
                      }`}
                    >
                      {page}
                    </Text>
                  </TouchableOpacity>
                ))}

                {/* Next arrow */}
                <TouchableOpacity
                  onPress={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-600 ${
                    currentPage === totalPages ? "opacity-40" : ""
                  }`}
                >
                  <Ionicons name="chevron-forward" size={16} color="#52525b" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* viewdish component */}
      <Modal
        visible={!!selectedItem}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          className="flex-1 bg-black/50 justify-center items-center p-4"
          onPress={() => setSelectedItem(null)}
        >
          {selectedItem && (
             <ViewDish
               item={selectedItem}
               onClose={() => setSelectedItem(null)}
               onAddToOrder={addToOrder}
             />
          )}
        </TouchableOpacity>
      </Modal>

      {/* filter component */}
      <Modal
        visible={filterButton}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFilterButton(false)}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          className="flex-1 bg-black/50 justify-center items-center p-4"
          onPress={() => setFilterButton(false)}
        >
          {filterButton && (
            <Filters
              onClose={() => setFilterButton(false)}
              onApply={setAppliedFilters}
              initialFilters={appliedFilters}
              mainCategory={mainCategory}
            />
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default FullMenu;
