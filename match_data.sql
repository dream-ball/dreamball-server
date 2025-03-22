-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 22, 2025 at 05:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `match_data`
--

-- --------------------------------------------------------

--
-- Table structure for table `contest`
--

CREATE TABLE `contest` (
  `s_no` int(11) NOT NULL,
  `match_id` int(50) NOT NULL,
  `contest_id` varchar(255) NOT NULL,
  `prize_pool` int(255) NOT NULL,
  `entry_fee` int(255) NOT NULL,
  `total_spots` int(255) NOT NULL,
  `spots_available` int(255) NOT NULL,
  `platform_fee` int(10) NOT NULL,
  `platform_filler_fee` int(10) NOT NULL,
  `type` varchar(20) NOT NULL,
  `minimum_players` int(10) NOT NULL,
  `prize_order` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`prize_order`)),
  `status` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deliveries`
--

CREATE TABLE `deliveries` (
  `id` int(11) NOT NULL,
  `over_id` int(11) NOT NULL,
  `ball_number` int(11) NOT NULL,
  `outcome` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `live_match_data`
--

CREATE TABLE `live_match_data` (
  `s_no` int(20) NOT NULL,
  `match_id` int(50) NOT NULL,
  `match_time` varchar(55) NOT NULL,
  `date_wise` varchar(55) NOT NULL,
  `live_time` datetime NOT NULL DEFAULT current_timestamp(),
  `match_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`match_data`)),
  `status` varchar(20) NOT NULL DEFAULT 'live',
  `match_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `s_no` int(11) NOT NULL,
  `match_id` int(50) NOT NULL,
  `match_time` varchar(55) NOT NULL,
  `date_wise` varchar(55) NOT NULL,
  `match_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`match_data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `open_overs`
--

CREATE TABLE `open_overs` (
  `s_no` int(255) NOT NULL,
  `match_id` int(50) NOT NULL,
  `innings` int(10) NOT NULL,
  `over_number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `order_id` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) NOT NULL,
  `receipt` varchar(255) NOT NULL,
  `status` enum('created','paid','failed','refunded') NOT NULL DEFAULT 'created',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_id`, `amount`, `currency`, `receipt`, `status`, `created_at`) VALUES
(46, 'dda1a440d0e5463b', 'order_Q9JJ4ZQJYdvqiy', 10000.00, 'INR', 'receipt#1', 'paid', '2025-03-20 23:05:05'),
(47, 'dda1a440d0e5463b', 'order_Q9KpU9vG32IybL', 10000.00, 'INR', 'receipt#1', 'paid', '2025-03-21 00:34:27'),
(48, 'a1b2c3d4e5f67890', 'order_Q9Lo3lcrOO3S3R', 100000.00, 'INR', 'receipt#1', 'paid', '2025-03-21 01:31:48');

-- --------------------------------------------------------

--
-- Table structure for table `overs`
--

CREATE TABLE `overs` (
  `id` int(11) NOT NULL,
  `match_id` int(50) DEFAULT NULL,
  `innings` int(20) NOT NULL,
  `over_number` int(11) NOT NULL,
  `bowler` varchar(100) NOT NULL,
  `runs` int(11) NOT NULL,
  `score` varchar(10) NOT NULL,
  `wickets` int(11) NOT NULL,
  `team` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reference`
--

CREATE TABLE `reference` (
  `s_no` int(11) NOT NULL,
  `match_id` int(50) NOT NULL,
  `referecne_id` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `registered_contest`
--

CREATE TABLE `registered_contest` (
  `s_no` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `match_id` int(50) NOT NULL,
  `contest_id` int(255) NOT NULL,
  `entry_fee` int(255) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'upcoming',
  `points` int(100) NOT NULL DEFAULT 0,
  `reg_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

CREATE TABLE `user_details` (
  `user_id` varchar(255) NOT NULL,
  `mail_id` varchar(255) NOT NULL,
  `user_name` varchar(15) DEFAULT NULL,
  `user_token` varchar(255) NOT NULL,
  `user_profile` varchar(255) NOT NULL DEFAULT '''https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&s''',
  `deposits` int(100) NOT NULL DEFAULT 0,
  `funds` int(11) NOT NULL,
  `referral_code` varchar(10) NOT NULL,
  `refered_by` varchar(10) DEFAULT NULL,
  `first_deposit` varchar(5) NOT NULL DEFAULT 'true'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_details`
--

INSERT INTO `user_details` (`user_id`, `mail_id`, `user_name`, `user_token`, `user_profile`, `deposits`, `funds`, `referral_code`, `refered_by`, `first_deposit`) VALUES
('a1b2c3d4e5f67890', 'user1@test.com', 'user_one', 'user_one', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&s', 10, 25, 'acb123', NULL, 'true'),
('b2c3d4e5f678901a', 'user2@test.com', 'user_two', 'user_two', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&s', 10, 0, 'cde123', NULL, 'true'),
('c3d4e5f678901ab2', 'user3@test.com', 'user_three', 'user_three', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&s', 0, 4, 'ele123', NULL, 'true'),
('d4e5f678901ab2c3', 'user4@test.com', 'user_four', 'user_four', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&s', 0, 4, 'usr123', NULL, 'true'),
('dda1a440d0e5463b', 'test@123', 'vignesh', 'test123', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&s', 10, 15, 'vig123', NULL, 'true'),
('e5f678901ab2c3d4', 'user5@test.com', 'user_five', 'user_five', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&s', 0, 15, 'lik123', NULL, 'true');

-- --------------------------------------------------------

--
-- Table structure for table `user_kyc`
--

CREATE TABLE `user_kyc` (
  `s_no` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `dob` varchar(10) NOT NULL,
  `age` int(11) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `aadhaar_number` varchar(12) NOT NULL,
  `pan_number` varchar(20) NOT NULL,
  `aadhaar_front_image` longtext NOT NULL,
  `aadhaar_back_image` longtext NOT NULL,
  `pan_image` longtext NOT NULL,
  `kyc_status` varchar(20) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_over_data`
--

CREATE TABLE `user_over_data` (
  `s_no` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `match_id` int(50) NOT NULL,
  `innings` int(10) NOT NULL,
  `over_number` int(12) NOT NULL,
  `run` varchar(50) DEFAULT NULL,
  `four` varchar(50) DEFAULT NULL,
  `six` varchar(50) DEFAULT NULL,
  `wicket` varchar(50) DEFAULT NULL,
  `dot` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contest`
--
ALTER TABLE `contest`
  ADD PRIMARY KEY (`s_no`);

--
-- Indexes for table `deliveries`
--
ALTER TABLE `deliveries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_match_deliveries` (`over_id`,`ball_number`);

--
-- Indexes for table `live_match_data`
--
ALTER TABLE `live_match_data`
  ADD PRIMARY KEY (`s_no`),
  ADD UNIQUE KEY `match_id` (`match_id`);

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`match_id`),
  ADD UNIQUE KEY `s_no` (`s_no`);

--
-- Indexes for table `open_overs`
--
ALTER TABLE `open_overs`
  ADD PRIMARY KEY (`s_no`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `overs`
--
ALTER TABLE `overs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_match_over` (`match_id`,`over_number`,`innings`);

--
-- Indexes for table `reference`
--
ALTER TABLE `reference`
  ADD PRIMARY KEY (`s_no`),
  ADD UNIQUE KEY `referecne_id` (`referecne_id`);

--
-- Indexes for table `registered_contest`
--
ALTER TABLE `registered_contest`
  ADD PRIMARY KEY (`s_no`),
  ADD UNIQUE KEY `unique_contest_data` (`user_id`,`match_id`,`contest_id`);

--
-- Indexes for table `user_details`
--
ALTER TABLE `user_details`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_kyc`
--
ALTER TABLE `user_kyc`
  ADD PRIMARY KEY (`s_no`),
  ADD UNIQUE KEY `pan_number` (`pan_number`),
  ADD UNIQUE KEY `aadhaar_number` (`aadhaar_number`);

--
-- Indexes for table `user_over_data`
--
ALTER TABLE `user_over_data`
  ADD PRIMARY KEY (`s_no`),
  ADD UNIQUE KEY `unique_user_data` (`user_id`,`match_id`,`over_number`,`innings`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contest`
--
ALTER TABLE `contest`
  MODIFY `s_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1079;

--
-- AUTO_INCREMENT for table `deliveries`
--
ALTER TABLE `deliveries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35347;

--
-- AUTO_INCREMENT for table `live_match_data`
--
ALTER TABLE `live_match_data`
  MODIFY `s_no` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=187;

--
-- AUTO_INCREMENT for table `matches`
--
ALTER TABLE `matches`
  MODIFY `s_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=212;

--
-- AUTO_INCREMENT for table `open_overs`
--
ALTER TABLE `open_overs`
  MODIFY `s_no` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `overs`
--
ALTER TABLE `overs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5795;

--
-- AUTO_INCREMENT for table `reference`
--
ALTER TABLE `reference`
  MODIFY `s_no` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `registered_contest`
--
ALTER TABLE `registered_contest`
  MODIFY `s_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=172;

--
-- AUTO_INCREMENT for table `user_kyc`
--
ALTER TABLE `user_kyc`
  MODIFY `s_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `user_over_data`
--
ALTER TABLE `user_over_data`
  MODIFY `s_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=178;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `deliveries`
--
ALTER TABLE `deliveries`
  ADD CONSTRAINT `deliveries_ibfk_1` FOREIGN KEY (`over_id`) REFERENCES `overs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `overs`
--
ALTER TABLE `overs`
  ADD CONSTRAINT `overs_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `live_match_data` (`match_id`) ON DELETE CASCADE;

--
-- Constraints for table `registered_contest`
--
ALTER TABLE `registered_contest`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `user_details` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
