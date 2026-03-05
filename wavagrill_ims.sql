-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 05, 2026 at 09:35 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wavagrill_ims`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_log`
--

CREATE TABLE `audit_log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `target_table` varchar(50) DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_log`
--

INSERT INTO `audit_log` (`id`, `user_id`, `action`, `target_table`, `target_id`, `old_value`, `new_value`, `created_at`) VALUES
(1, 1, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 00:41:33'),
(2, 2, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 00:42:19'),
(3, 2, 'SUPPLY_DISPATCHED', 'supply_log', 1, NULL, '{\"ingredient\":\"Olive Oil\",\"location\":\"Greenville\",\"quantity\":2}', '2026-03-06 00:43:39'),
(4, 2, 'SUPPLY_DISPATCHED', 'supply_log', 2, NULL, '{\"ingredient\":\"Olive Oil\",\"location\":\"Denton\",\"quantity\":7}', '2026-03-06 00:44:32'),
(5, 5, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 00:45:03'),
(6, 5, 'STOCK_UPDATE', 'location_inventory', NULL, '{\"ingredient_id\":1,\"old\":\"2.00\"}', '{\"current_quantity\":2}', '2026-03-06 00:45:30'),
(7, 5, 'STOCK_UPDATE', 'location_inventory', NULL, '{\"ingredient_id\":2,\"old\":\"2.00\"}', '{\"current_quantity\":2}', '2026-03-06 00:45:30'),
(8, 5, 'STOCK_UPDATE', 'location_inventory', NULL, '{\"ingredient_id\":3,\"old\":\"10.00\"}', '{\"current_quantity\":10}', '2026-03-06 00:45:30'),
(9, 5, 'STOCK_UPDATE', 'location_inventory', NULL, '{\"ingredient_id\":4,\"old\":\"200.00\"}', '{\"current_quantity\":200}', '2026-03-06 00:45:30'),
(10, 5, 'STOCK_UPDATE', 'location_inventory', NULL, '{\"ingredient_id\":5,\"old\":\"5.00\"}', '{\"current_quantity\":6}', '2026-03-06 00:45:31'),
(11, 2, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 00:45:47'),
(12, 2, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 00:45:55'),
(13, 1, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 00:47:06'),
(14, 3, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 00:58:50'),
(15, 1, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 01:06:40'),
(16, 1, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 01:06:57'),
(17, 2, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 01:08:31'),
(18, 1, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 01:10:35'),
(19, 1, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 01:18:40'),
(20, 2, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 01:20:14'),
(21, 2, 'SUPPLY_DISPATCHED', 'supply_log', 3, NULL, '{\"ingredient\":\"Olive Oil\",\"location\":\"Richardson\",\"quantity\":0.02}', '2026-03-06 01:22:26'),
(22, 5, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 01:24:04'),
(23, 5, 'STOCK_UPDATE', 'location_inventory', NULL, '{\"ingredient_id\":1,\"old\":\"2.00\"}', '{\"current_quantity\":6}', '2026-03-06 01:24:31'),
(24, 5, 'STOCK_UPDATE', 'location_inventory', NULL, '{\"ingredient_id\":2,\"old\":\"2.00\"}', '{\"current_quantity\":2}', '2026-03-06 01:24:31'),
(25, 5, 'STOCK_UPDATE', 'location_inventory', NULL, '{\"ingredient_id\":3,\"old\":\"10.00\"}', '{\"current_quantity\":10}', '2026-03-06 01:24:31'),
(26, 5, 'STOCK_UPDATE', 'location_inventory', NULL, '{\"ingredient_id\":4,\"old\":\"200.00\"}', '{\"current_quantity\":200}', '2026-03-06 01:24:31'),
(27, 5, 'STOCK_UPDATE', 'location_inventory', NULL, '{\"ingredient_id\":5,\"old\":\"6.00\"}', '{\"current_quantity\":6}', '2026-03-06 01:24:31'),
(28, 2, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 01:24:46'),
(29, 1, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 01:24:54'),
(30, 2, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 01:25:05'),
(31, 1, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 01:35:05'),
(32, 2, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 01:35:33'),
(33, 1, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 02:00:58'),
(34, 1, 'LOGIN', NULL, NULL, NULL, NULL, '2026-03-06 02:01:14');

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `unit` varchar(30) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`id`, `name`, `unit`, `is_active`, `created_by`, `created_at`) VALUES
(1, 'Tomatoes', 'kg', 1, 2, '2026-03-06 00:03:19'),
(2, 'Onions', 'kg', 1, 2, '2026-03-06 00:03:19'),
(3, 'Gyros', 'kg', 1, 2, '2026-03-06 00:03:19'),
(4, 'Pita Bread', 'pcs', 1, 2, '2026-03-06 00:03:19'),
(5, 'Olive Oil', 'liters', 1, 2, '2026-03-06 00:03:19');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `location_code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `location_code`, `name`, `is_active`, `created_at`) VALUES
(1, 'LOC-001', 'Greenville', 1, '2026-03-06 00:03:19'),
(2, 'LOC-002', 'Richardson', 1, '2026-03-06 00:03:19'),
(3, 'LOC-003', 'Denton', 1, '2026-03-06 00:03:19'),
(4, 'LOC-004', 'Plaza of Americas', 1, '2026-03-06 00:03:19');

-- --------------------------------------------------------

--
-- Table structure for table `location_inventory`
--

CREATE TABLE `location_inventory` (
  `id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `max_quantity` decimal(10,2) NOT NULL DEFAULT 0.00,
  `min_quantity` decimal(10,2) NOT NULL DEFAULT 0.00,
  `current_quantity` decimal(10,2) NOT NULL DEFAULT 0.00,
  `already_supplied` decimal(10,2) NOT NULL DEFAULT 0.00,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `location_inventory`
--

INSERT INTO `location_inventory` (`id`, `location_id`, `ingredient_id`, `max_quantity`, `min_quantity`, `current_quantity`, `already_supplied`, `updated_at`, `updated_by`) VALUES
(1, 1, 1, 15.00, 0.00, 12.00, 2.00, '2026-03-06 00:03:19', NULL),
(2, 1, 2, 8.00, 0.00, 6.00, 1.00, '2026-03-06 00:03:19', NULL),
(3, 1, 3, 30.00, 0.00, 25.00, 10.00, '2026-03-06 00:03:19', NULL),
(4, 1, 4, 250.00, 0.00, 200.00, 50.00, '2026-03-06 00:03:19', NULL),
(5, 1, 5, 20.00, 0.00, 15.00, 7.00, '2026-03-06 00:43:39', NULL),
(6, 2, 1, 12.00, 0.00, 8.00, 2.00, '2026-03-06 00:03:19', NULL),
(7, 2, 2, 6.00, 0.00, 2.00, 1.00, '2026-03-06 00:03:19', NULL),
(8, 2, 3, 25.00, 0.00, 15.00, 5.00, '2026-03-06 00:03:19', NULL),
(9, 2, 4, 200.00, 0.00, 150.00, 50.00, '2026-03-06 00:03:19', NULL),
(10, 2, 5, 15.00, 0.00, 5.00, 5.02, '2026-03-06 01:22:26', NULL),
(11, 3, 1, 10.00, 0.00, 6.00, 2.00, '2026-03-06 01:24:31', 5),
(12, 3, 2, 5.00, 0.00, 2.00, 3.00, '2026-03-06 00:45:30', 5),
(13, 3, 3, 25.00, 0.00, 10.00, 15.00, '2026-03-06 00:45:30', 5),
(14, 3, 4, 200.00, 0.00, 200.00, 200.00, '2026-03-06 00:45:30', 5),
(15, 3, 5, 15.00, 0.00, 6.00, 17.00, '2026-03-06 00:45:31', 5),
(16, 4, 1, 18.00, 0.00, 14.00, 3.00, '2026-03-06 00:03:19', NULL),
(17, 4, 2, 10.00, 0.00, 8.00, 2.00, '2026-03-06 00:03:19', NULL),
(18, 4, 3, 35.00, 0.00, 20.00, 10.00, '2026-03-06 00:03:19', NULL),
(19, 4, 4, 300.00, 0.00, 280.00, 100.00, '2026-03-06 00:03:19', NULL),
(20, 4, 5, 25.00, 0.00, 20.00, 8.00, '2026-03-06 00:03:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `supply_log`
--

CREATE TABLE `supply_log` (
  `id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `quantity_dispatched` decimal(10,2) NOT NULL,
  `dispatched_by` int(11) NOT NULL,
  `dispatched_at` datetime NOT NULL DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supply_log`
--

INSERT INTO `supply_log` (`id`, `location_id`, `ingredient_id`, `quantity_dispatched`, `dispatched_by`, `dispatched_at`, `notes`) VALUES
(1, 1, 5, 2.00, 2, '2026-03-06 00:43:39', NULL),
(2, 3, 5, 7.00, 2, '2026-03-06 00:44:32', NULL),
(3, 2, 5, 0.02, 2, '2026-03-06 01:22:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('SUPER_ADMIN','ADMIN','KITCHEN_USER') NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `location_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'System Owner', 'superadmin@wavagrill.com', '$2a$10$vpYU4QqL1qyMsZR3Ru65YeLvqmj4iV.tA0jq0UwOuSQaYn3HsO3N2', 'SUPER_ADMIN', NULL, 1, '2026-03-06 00:03:19', '2026-03-06 00:40:34'),
(2, 'Central Kitchen', 'admin@wavagrill.com', '$2a$10$vpYU4QqL1qyMsZR3Ru65YeLvqmj4iV.tA0jq0UwOuSQaYn3HsO3N2', 'ADMIN', NULL, 1, '2026-03-06 00:03:19', '2026-03-06 00:40:34'),
(3, 'Greenville Manager', 'greenville@wavagrill.com', '$2a$10$vpYU4QqL1qyMsZR3Ru65YeLvqmj4iV.tA0jq0UwOuSQaYn3HsO3N2', 'KITCHEN_USER', 1, 1, '2026-03-06 00:03:19', '2026-03-06 00:40:34'),
(4, 'Richardson Manager', 'richardson@wavagrill.com', '$2a$10$vpYU4QqL1qyMsZR3Ru65YeLvqmj4iV.tA0jq0UwOuSQaYn3HsO3N2', 'KITCHEN_USER', 2, 1, '2026-03-06 00:03:19', '2026-03-06 00:40:34'),
(5, 'Denton Manager', 'denton@wavagrill.com', '$2a$10$vpYU4QqL1qyMsZR3Ru65YeLvqmj4iV.tA0jq0UwOuSQaYn3HsO3N2', 'KITCHEN_USER', 3, 1, '2026-03-06 00:03:19', '2026-03-06 00:40:34'),
(6, 'Plaza Manager', 'plaza@wavagrill.com', '$2a$10$vpYU4QqL1qyMsZR3Ru65YeLvqmj4iV.tA0jq0UwOuSQaYn3HsO3N2', 'KITCHEN_USER', 4, 1, '2026-03-06 00:03:19', '2026-03-06 00:40:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `location_code` (`location_code`);

--
-- Indexes for table `location_inventory`
--
ALTER TABLE `location_inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_loc_ing` (`location_id`,`ingredient_id`),
  ADD KEY `ingredient_id` (`ingredient_id`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `supply_log`
--
ALTER TABLE `supply_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `ingredient_id` (`ingredient_id`),
  ADD KEY `dispatched_by` (`dispatched_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `location_id` (`location_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `location_inventory`
--
ALTER TABLE `location_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `supply_log`
--
ALTER TABLE `supply_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD CONSTRAINT `audit_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD CONSTRAINT `ingredients_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `location_inventory`
--
ALTER TABLE `location_inventory`
  ADD CONSTRAINT `location_inventory_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`),
  ADD CONSTRAINT `location_inventory_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`),
  ADD CONSTRAINT `location_inventory_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `supply_log`
--
ALTER TABLE `supply_log`
  ADD CONSTRAINT `supply_log_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`),
  ADD CONSTRAINT `supply_log_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`),
  ADD CONSTRAINT `supply_log_ibfk_3` FOREIGN KEY (`dispatched_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
