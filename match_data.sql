-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2025 at 05:19 PM
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
  `match_id` int(11) NOT NULL,
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

--
-- Dumping data for table `contest`
--

INSERT INTO `contest` (`s_no`, `match_id`, `contest_id`, `prize_pool`, `entry_fee`, `total_spots`, `spots_available`, `platform_fee`, `platform_filler_fee`, `type`, `minimum_players`, `prize_order`, `status`) VALUES
(1049, 7683, '1', 100, 10, 12, 6, 10, 20, 'entry', 3, '{\"stage1\":\"1:25\",\"stage2\":\"2:15\",\"stage3\":\"3-8:10\"}', 'ended'),
(1050, 7683, '2', 16750, 99, 225, 224, 25, 5525, 'entry', 3, '{\"stage1\":\"1:700\",\"stage2\":\"2:800\",\"stage3\":\"3-4:500\",\"stage4\":\"5-6:300\",\"stage5\":\"7-25:225\",\"stage6\":\"26-50:175\",\"stage7\":\"51-100:80\"}', 'cancelled'),
(1051, 7683, '3', 126000, 75, 2000, 1999, 18, 24000, 'entry', 3, '{\"stage1\":\"1-420:300\"}', 'cancelled'),
(1052, 7683, '4', 810, 45, 21, 20, 18, 135, 'entry', 3, '{\"stage1\":\"1-9:90\"}', 'cancelled'),
(1053, 7683, '5', 0, 0, 20, 19, 0, 0, 'practice', 1, '{\"stage1\":\"1-20:0\"}', 'cancelled'),
(1054, 7844, '1', 100, 10, 12, 11, 10, 20, 'entry', 3, '{\"stage1\":\"1:25\",\"stage2\":\"2:15\",\"stage3\":\"3-8:10\"}', 'upcoming'),
(1055, 7844, '2', 16750, 99, 225, 224, 25, 5525, 'entry', 3, '{\"stage1\":\"1:700\",\"stage2\":\"2:800\",\"stage3\":\"3-4:500\",\"stage4\":\"5-6:300\",\"stage5\":\"7-25:225\",\"stage6\":\"26-50:175\",\"stage7\":\"51-100:80\"}', 'upcoming'),
(1056, 7844, '3', 126000, 75, 2000, 1999, 18, 24000, 'entry', 3, '{\"stage1\":\"1-420:300\"}', 'upcoming'),
(1057, 7844, '4', 810, 45, 21, 20, 18, 135, 'entry', 3, '{\"stage1\":\"1-9:90\"}', 'upcoming'),
(1058, 7844, '5', 0, 0, 20, 19, 0, 0, 'practice', 1, '{\"stage1\":\"1-20:0\"}', 'upcoming'),
(1059, 7860, '1', 100, 10, 12, 12, 10, 20, 'entry', 3, '{\"stage1\":\"1:25\",\"stage2\":\"2:15\",\"stage3\":\"3-8:10\"}', 'upcoming'),
(1060, 7860, '2', 16750, 99, 225, 225, 25, 5525, 'entry', 3, '{\"stage1\":\"1:700\",\"stage2\":\"2:800\",\"stage3\":\"3-4:500\",\"stage4\":\"5-6:300\",\"stage5\":\"7-25:225\",\"stage6\":\"26-50:175\",\"stage7\":\"51-100:80\"}', 'upcoming'),
(1061, 7860, '3', 126000, 75, 2000, 2000, 18, 24000, 'entry', 3, '{\"stage1\":\"1-420:300\"}', 'upcoming'),
(1062, 7860, '4', 810, 45, 21, 21, 18, 135, 'entry', 3, '{\"stage1\":\"1-9:90\"}', 'upcoming'),
(1063, 7860, '5', 0, 0, 20, 20, 0, 0, 'practice', 1, '{\"stage1\":\"1-20:0\"}', 'upcoming'),
(1064, 7799, '1', 100, 10, 12, 11, 10, 20, 'entry', 3, '{\"stage1\":\"1:25\",\"stage2\":\"2:15\",\"stage3\":\"3-8:10\"}', 'upcoming'),
(1065, 7799, '2', 16750, 99, 225, 224, 25, 5525, 'entry', 3, '{\"stage1\":\"1:700\",\"stage2\":\"2:800\",\"stage3\":\"3-4:500\",\"stage4\":\"5-6:300\",\"stage5\":\"7-25:225\",\"stage6\":\"26-50:175\",\"stage7\":\"51-100:80\"}', 'upcoming'),
(1066, 7799, '3', 126000, 75, 2000, 2000, 18, 24000, 'entry', 3, '{\"stage1\":\"1-420:300\"}', 'upcoming'),
(1067, 7799, '4', 810, 45, 21, 21, 18, 135, 'entry', 3, '{\"stage1\":\"1-9:90\"}', 'upcoming'),
(1068, 7799, '5', 0, 0, 20, 20, 0, 0, 'practice', 1, '{\"stage1\":\"1-20:0\"}', 'upcoming'),
(1069, 7684, '1', 100, 10, 12, 12, 10, 20, 'entry', 3, '{\"stage1\":\"1:25\",\"stage2\":\"2:15\",\"stage3\":\"3-8:10\"}', 'upcoming'),
(1070, 7684, '2', 16750, 99, 225, 225, 25, 5525, 'entry', 3, '{\"stage1\":\"1:700\",\"stage2\":\"2:800\",\"stage3\":\"3-4:500\",\"stage4\":\"5-6:300\",\"stage5\":\"7-25:225\",\"stage6\":\"26-50:175\",\"stage7\":\"51-100:80\"}', 'upcoming'),
(1071, 7684, '3', 126000, 75, 2000, 2000, 18, 24000, 'entry', 3, '{\"stage1\":\"1-420:300\"}', 'upcoming'),
(1072, 7684, '4', 810, 45, 21, 21, 18, 135, 'entry', 3, '{\"stage1\":\"1-9:90\"}', 'upcoming'),
(1073, 7684, '5', 0, 0, 20, 20, 0, 0, 'practice', 1, '{\"stage1\":\"1-20:0\"}', 'upcoming'),
(1074, 7719, '1', 100, 10, 12, 12, 10, 20, 'entry', 3, '{\"stage1\":\"1:25\",\"stage2\":\"2:15\",\"stage3\":\"3-8:10\"}', 'upcoming'),
(1075, 7719, '2', 16750, 99, 225, 225, 25, 5525, 'entry', 3, '{\"stage1\":\"1:700\",\"stage2\":\"2:800\",\"stage3\":\"3-4:500\",\"stage4\":\"5-6:300\",\"stage5\":\"7-25:225\",\"stage6\":\"26-50:175\",\"stage7\":\"51-100:80\"}', 'upcoming'),
(1076, 7719, '3', 126000, 75, 2000, 2000, 18, 24000, 'entry', 3, '{\"stage1\":\"1-420:300\"}', 'upcoming'),
(1077, 7719, '4', 810, 45, 21, 21, 18, 135, 'entry', 3, '{\"stage1\":\"1-9:90\"}', 'upcoming'),
(1078, 7719, '5', 0, 0, 20, 20, 0, 0, 'practice', 1, '{\"stage1\":\"1-20:0\"}', 'upcoming');

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

--
-- Dumping data for table `deliveries`
--

INSERT INTO `deliveries` (`id`, `over_id`, `ball_number`, `outcome`) VALUES
(35273, 5785, 1, '1'),
(35274, 5785, 2, '6'),
(35275, 5785, 3, '4'),
(35276, 5785, 4, 'WB'),
(35277, 5785, 5, 'W'),
(35278, 5785, 6, '0'),
(35279, 5785, 7, '1'),
(35280, 5785, 8, '2'),
(35287, 5786, 1, '3'),
(35288, 5786, 2, 'W'),
(35289, 5786, 3, '4'),
(35290, 5786, 4, '1'),
(35291, 5786, 5, '3'),
(35292, 5786, 6, '6'),
(35293, 5787, 1, '1'),
(35294, 5787, 2, 'W'),
(35295, 5787, 3, '4'),
(35296, 5787, 4, '0'),
(35297, 5787, 5, '2'),
(35298, 5787, 6, '4'),
(35299, 5788, 1, 'W'),
(35300, 5788, 2, '0'),
(35301, 5788, 3, '2'),
(35302, 5788, 4, '1'),
(35303, 5788, 5, '4'),
(35304, 5788, 6, '0'),
(35305, 5789, 1, '1'),
(35306, 5789, 2, '0'),
(35307, 5789, 3, '1'),
(35308, 5789, 4, '0'),
(35309, 5789, 5, '0'),
(35310, 5789, 6, '3'),
(35311, 5790, 1, '0'),
(35312, 5790, 2, '1'),
(35313, 5790, 3, '2'),
(35314, 5790, 4, '1'),
(35315, 5790, 5, '0'),
(35316, 5790, 6, 'W'),
(35317, 5791, 1, '6'),
(35318, 5791, 2, '1'),
(35319, 5791, 3, '1'),
(35320, 5791, 4, '2'),
(35321, 5791, 5, '3'),
(35322, 5791, 6, '0'),
(35329, 5792, 1, '0'),
(35330, 5792, 2, '2'),
(35331, 5792, 3, '0'),
(35332, 5792, 4, '4'),
(35333, 5792, 5, '1'),
(35334, 5792, 6, '0'),
(35335, 5793, 1, 'W'),
(35336, 5793, 2, '4'),
(35337, 5793, 3, '6'),
(35338, 5793, 4, '6'),
(35339, 5793, 5, '2'),
(35340, 5793, 6, 'W'),
(35341, 5794, 1, '0'),
(35342, 5794, 2, '0'),
(35343, 5794, 3, '0'),
(35344, 5794, 4, '0'),
(35345, 5794, 5, '0'),
(35346, 5794, 6, '0');

-- --------------------------------------------------------

--
-- Table structure for table `live_match_data`
--

CREATE TABLE `live_match_data` (
  `s_no` int(20) NOT NULL,
  `match_id` int(20) NOT NULL,
  `match_time` varchar(55) NOT NULL,
  `date_wise` varchar(55) NOT NULL,
  `live_time` datetime NOT NULL DEFAULT current_timestamp(),
  `match_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`match_data`)),
  `status` varchar(20) NOT NULL DEFAULT 'live'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `live_match_data`
--

INSERT INTO `live_match_data` (`s_no`, `match_id`, `match_time`, `date_wise`, `live_time`, `match_data`, `status`) VALUES
(186, 7683, '03:00 PM', '21 Mar 2025, Friday', '2025-03-21 10:00:06', '{\"team_b_id\":607,\"date_wise\":\"21 Mar 2025, Friday\",\"max_rate\":\"0.00\",\"match_id\":7683,\"venue\":\"Cartama Oval, Cartama\",\"match_status\":\"Upcoming\",\"matchs\":\"Eliminator, Championship Week\",\"venue_id\":223,\"series\":\"European Cricket League, 2025\",\"team_a_id\":639,\"match_date\":\"21-Mar\",\"team_a_img\":\"https://cricketchampion.co.in/webroot/img/teams/1405363061_team.png\",\"min_rate\":\"0.00\",\"match_time\":\"03:00 PM\",\"match_type\":\"T10\",\"team_b_img\":\"https://cricketchampion.co.in/webroot/img/teams/822032673_team.jpg\",\"team_b_short\":\"ZNC\",\"team_b\":\"Zurich Nomads\",\"team_a_short\":\"RCC\",\"fav_team\":\"\",\"team_a\":\"Roma CC\",\"is_hundred\":1,\"series_id\":515,\"series_type\":\"Local\"}', 'ended');

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `s_no` int(11) NOT NULL,
  `match_id` int(11) NOT NULL,
  `match_time` varchar(55) NOT NULL,
  `date_wise` varchar(55) NOT NULL,
  `match_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`match_data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `matches`
--

INSERT INTO `matches` (`s_no`, `match_id`, `match_time`, `date_wise`, `match_data`) VALUES
(210, 7684, '05:30 PM', '21 Mar 2025, Friday', '{\"team_b_id\":638,\"date_wise\":\"21 Mar 2025, Friday\",\"max_rate\":\"0.00\",\"match_id\":7684,\"venue\":\"Cartama Oval, Cartama\",\"match_status\":\"Upcoming\",\"matchs\":\"Qualifier 1, Championship Week\",\"venue_id\":223,\"series\":\"European Cricket League, 2025\",\"team_a_id\":601,\"match_date\":\"21-Mar\",\"team_a_img\":\"https://cricketchampion.co.in/webroot/img/teams/1347746152_team.png\",\"min_rate\":\"0.00\",\"match_time\":\"05:30 PM\",\"match_type\":\"T10\",\"team_b_img\":\"https://cricketchampion.co.in/webroot/img/teams/1706353235_team.jpeg\",\"team_b_short\":\"FAR\",\"team_b\":\"Farmers\",\"team_a_short\":\"SKA\",\"fav_team\":\"\",\"team_a\":\"Skanderborg\",\"is_hundred\":1,\"series_id\":515,\"series_type\":\"Local\"}'),
(211, 7719, '06:00 PM', '21 Mar 2025, Friday', '{\"team_b_id\":632,\"date_wise\":\"21 Mar 2025, Friday\",\"max_rate\":\"1.9\",\"match_id\":7719,\"venue\":\"Mazgaon Cricket Club Ground, Kalamboli\",\"match_status\":\"Upcoming\",\"matchs\":\"2nd Semi Final\",\"venue_id\":227,\"series\":\"Mumbai Premier League T20, 2025\",\"team_a_id\":628,\"match_date\":\"21-Mar\",\"team_a_img\":\"https://cricketchampion.co.in/webroot/img/teams/1926739445_team.png\",\"min_rate\":\"1.61\",\"match_time\":\"06:00 PM\",\"match_type\":\"T20\",\"team_b_img\":\"https://cricketchampion.co.in/webroot/img/teams/487827810_team.png\",\"team_b_short\":\"THT\",\"team_b\":\"Thane Tigers\",\"team_a_short\":\"VAW\",\"fav_team\":\"VAW\",\"team_a\":\"Vashi Warriors\",\"is_hundred\":1,\"series_id\":519,\"series_type\":\"Local\"}'),
(209, 7799, '05:30 PM', '21 Mar 2025, Friday', '{\"team_b_id\":365,\"date_wise\":\"21 Mar 2025, Friday\",\"max_rate\":\"1.69\",\"match_id\":7799,\"venue\":\"Namibia Cricket Ground, Windhoek\",\"match_status\":\"Upcoming\",\"matchs\":\"3rd T20I\",\"venue_id\":233,\"series\":\"Canada tour of Namibia, 2025\",\"team_a_id\":105,\"match_date\":\"21-Mar\",\"team_a_img\":\"https://cricketchampion.co.in/webroot/img/teams/220140325_team.png\",\"min_rate\":\"1.63\",\"match_time\":\"05:30 PM\",\"match_type\":\"T20\",\"team_b_img\":\"https://cricketchampion.co.in/webroot/img/teams/273714469_team.png\",\"team_b_short\":\"CAN\",\"team_b\":\"Canada\",\"team_a_short\":\"NAM\",\"fav_team\":\"NAM\",\"team_a\":\"Namibia\",\"is_hundred\":1,\"series_id\":529,\"series_type\":\"International\"}'),
(207, 7844, '04:30 PM', '21 Mar 2025, Friday', '{\"team_b_id\":666,\"date_wise\":\"21 Mar 2025, Friday\",\"max_rate\":\"0.00\",\"match_id\":7844,\"venue\":\"Lugogo Stadium, Kampala\",\"match_status\":\"Upcoming\",\"matchs\":\"2nd Semi Final\",\"venue_id\":231,\"series\":\"Uganda T20 League, 2025\",\"team_a_id\":667,\"match_date\":\"21-Mar\",\"team_a_img\":\"https://cricketchampion.co.in/webroot/img/teams/420619523_team.png\",\"min_rate\":\"0.00\",\"match_time\":\"04:30 PM\",\"match_type\":\"T20\",\"team_b_img\":\"https://cricketchampion.co.in/webroot/img/teams/184410051_team.png\",\"team_b_short\":\"SAP\",\"team_b\":\"Sapphire\",\"team_a_short\":\"GLD\",\"fav_team\":\"\",\"team_a\":\"Gold\",\"is_hundred\":1,\"series_id\":532,\"series_type\":\"Local\"}'),
(208, 7860, '05:00 PM', '21 Mar 2025, Friday', '{\"team_b_id\":654,\"date_wise\":\"21 Mar 2025, Friday\",\"max_rate\":\"0.00\",\"match_id\":7860,\"venue\":\"Multan Cricket Stadium, Multan\",\"match_status\":\"Upcoming\",\"matchs\":\"29th Match, Group A\",\"venue_id\":108,\"series\":\"Pakistan T20 Cup, 2025\",\"team_a_id\":652,\"match_date\":\"21-Mar\",\"team_a_img\":\"https://cricketchampion.co.in/webroot/img/teams/991646262_team.png\",\"min_rate\":\"0.00\",\"match_time\":\"05:00 PM\",\"match_type\":\"T20\",\"team_b_img\":\"https://cricketchampion.co.in/webroot/img/teams/1128153253_team.jpg\",\"team_b_short\":\"KB\",\"team_b\":\"Karachi Blues\",\"team_a_short\":\"LW\",\"fav_team\":\"\",\"team_a\":\"Lahore Whites\",\"is_hundred\":1,\"series_id\":531,\"series_type\":\"Local\"}');

-- --------------------------------------------------------

--
-- Table structure for table `open_overs`
--

CREATE TABLE `open_overs` (
  `s_no` int(255) NOT NULL,
  `match_id` int(11) NOT NULL,
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
  `match_id` int(20) DEFAULT NULL,
  `innings` int(20) NOT NULL,
  `over_number` int(11) NOT NULL,
  `bowler` varchar(100) NOT NULL,
  `runs` int(11) NOT NULL,
  `score` varchar(10) NOT NULL,
  `wickets` int(11) NOT NULL,
  `team` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `overs`
--

INSERT INTO `overs` (`id`, `match_id`, `innings`, `over_number`, `bowler`, `runs`, `score`, `wickets`, `team`) VALUES
(5785, 7683, 1, 1, 'PARVESH', 15, '15-1', 1, 'RCC'),
(5786, 7683, 1, 2, 'Qwerty', 17, '32-2', 1, 'RCC'),
(5787, 7683, 1, 3, 'PRAVEEEN', 11, '43-3', 1, 'RCC'),
(5788, 7683, 1, 4, 'Raj', 7, '50-4', 1, 'RCC'),
(5789, 7683, 1, 5, 'VIGNESH', 5, '55-4', 0, 'RCC'),
(5790, 7683, 2, 1, 'SRIDHAR', 4, '4-1', 1, 'ZNC'),
(5791, 7683, 2, 2, 'THILAI', 13, '17-1', 0, 'ZNC'),
(5792, 7683, 2, 3, 'SNEHA PURUSAN', 7, '24-1', 0, 'ZNC'),
(5793, 7683, 2, 4, 'PRASSANNA', 18, '42-3', 2, 'ZNC'),
(5794, 7683, 2, 5, 'PRASSANNA', 0, '42-3', 0, 'ZNC');

-- --------------------------------------------------------

--
-- Table structure for table `registered_contest`
--

CREATE TABLE `registered_contest` (
  `s_no` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `match_id` int(255) NOT NULL,
  `contest_id` int(255) NOT NULL,
  `entry_fee` int(255) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'upcoming',
  `points` int(100) NOT NULL DEFAULT 0,
  `reg_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registered_contest`
--

INSERT INTO `registered_contest` (`s_no`, `user_id`, `match_id`, `contest_id`, `entry_fee`, `status`, `points`, `reg_time`) VALUES
(155, 'a1b2c3d4e5f67890', 7683, 1, 10, 'ended', -2, '2025-03-21 16:06:01'),
(156, 'e5f678901ab2c3d4', 7683, 1, 10, 'ended', -5, '2025-03-21 16:06:01'),
(157, 'c3d4e5f678901ab2', 7683, 1, 10, 'ended', -7, '2025-03-21 16:06:01'),
(158, 'b2c3d4e5f678901a', 7683, 1, 10, 'ended', -11, '2025-03-21 16:06:01'),
(159, 'c3d4e5f678901ab2', 7683, 2, 99, 'ended', -7, '2025-03-21 16:06:01'),
(160, 'c3d4e5f678901ab2', 7683, 3, 75, 'ended', -7, '2025-03-21 16:06:01'),
(161, 'c3d4e5f678901ab2', 7683, 4, 45, 'ended', -7, '2025-03-21 16:06:01'),
(162, 'c3d4e5f678901ab2', 7683, 5, 0, 'ended', -7, '2025-03-21 16:06:01'),
(163, 'dda1a440d0e5463b', 7683, 1, 10, 'ended', -5, '2025-03-21 16:06:01'),
(164, 'c3d4e5f678901ab2', 7844, 1, 10, 'upcoming', 0, '2025-03-21 04:11:55'),
(165, 'c3d4e5f678901ab2', 7844, 2, 99, 'upcoming', 0, '2025-03-21 04:12:05'),
(166, 'c3d4e5f678901ab2', 7844, 3, 75, 'upcoming', 0, '2025-03-21 04:12:07'),
(167, 'c3d4e5f678901ab2', 7844, 4, 45, 'upcoming', 0, '2025-03-21 04:12:16'),
(168, 'c3d4e5f678901ab2', 7844, 5, 0, 'upcoming', 0, '2025-03-21 04:12:18'),
(169, 'd4e5f678901ab2c3', 7683, 1, 10, 'ended', -7, '2025-03-21 16:06:01'),
(170, 'c3d4e5f678901ab2', 7799, 1, 10, 'upcoming', 0, '2025-03-21 04:29:54'),
(171, 'c3d4e5f678901ab2', 7799, 2, 99, 'upcoming', 0, '2025-03-21 04:29:57');

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
  `match_id` int(12) NOT NULL,
  `innings` int(10) NOT NULL,
  `over_number` int(12) NOT NULL,
  `run` varchar(50) DEFAULT NULL,
  `four` varchar(50) DEFAULT NULL,
  `six` varchar(50) DEFAULT NULL,
  `wicket` varchar(50) DEFAULT NULL,
  `dot` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_over_data`
--

INSERT INTO `user_over_data` (`s_no`, `user_id`, `match_id`, `innings`, `over_number`, `run`, `four`, `six`, `wicket`, `dot`) VALUES
(110, 'c3d4e5f678901ab2', 7683, 1, 1, 'More than 10', '1 - 2', '1 - 2', '1', '1 Dot'),
(111, 'dda1a440d0e5463b', 7683, 1, 1, 'More than 10', '1 - 2', 'No Sixes', 'No Wickets', '2 Dots'),
(112, 'd4e5f678901ab2c3', 7683, 1, 1, 'More than 10', 'More than 2', 'No Sixes', '1', '2 Dots'),
(113, 'a1b2c3d4e5f67890', 7683, 1, 1, 'More than 10', 'No Four', 'No Sixes', 'More than 2', NULL),
(114, 'e5f678901ab2c3d4', 7683, 1, 1, '1 - 5', '1 - 2', 'No Sixes', 'No Wickets', '2 Dots'),
(115, 'b2c3d4e5f678901a', 7683, 1, 1, 'More than 10', '1 - 2', '1 - 2', '1', '1 Dot'),
(131, 'dda1a440d0e5463b', 7683, 1, 2, '6 - 10', '1 - 2', 'No Sixes', 'No Wickets', '2 Dots'),
(132, 'e5f678901ab2c3d4', 7683, 1, 2, '6 - 10', '1 - 2', 'No Sixes', 'No Wickets', '2 Dots'),
(133, 'd4e5f678901ab2c3', 7683, 1, 3, 'More than 10', '1 - 2', '1 - 2', '1', '2 Dots'),
(134, 'dda1a440d0e5463b', 7683, 1, 3, 'More than 10', '1 - 2', '1 - 2', 'No Wickets', '2 Dots'),
(135, 'e5f678901ab2c3d4', 7683, 1, 3, 'More than 10', '1 - 2', 'No Sixes', '1', '1 Dot'),
(136, 'c3d4e5f678901ab2', 7683, 1, 3, 'More than 10', 'More than 2', '1 - 2', '1', '2 Dots'),
(137, 'b2c3d4e5f678901a', 7683, 1, 3, '1 - 5', '1 - 2', '1 - 2', '1', '1 Dot'),
(138, 'a1b2c3d4e5f67890', 7683, 1, 3, 'More than 10', '1 - 2', NULL, NULL, NULL),
(140, 'b2c3d4e5f678901a', 7683, 1, 4, 'More than 10', '1 - 2', '1 - 2', '1', '2 Dots'),
(141, 'c3d4e5f678901ab2', 7683, 1, 4, '1 - 5', '1 - 2', '1 - 2', '1', '1 Dot'),
(142, 'd4e5f678901ab2c3', 7683, 1, 4, 'More than 10', '1 - 2', '1 - 2', '1', '1 Dot'),
(143, 'dda1a440d0e5463b', 7683, 1, 5, 'More than 10', 'More than 2', '1 - 2', 'No Wickets', '2 Dots'),
(144, 'b2c3d4e5f678901a', 7683, 1, 5, 'More than 10', '1 - 2', '1 - 2', 'No Wickets', '2 Dots'),
(145, 'e5f678901ab2c3d4', 7683, 1, 5, '1 - 5', '1 - 2', 'No Sixes', 'No Wickets', '3 Dots'),
(147, 'd4e5f678901ab2c3', 7683, 1, 5, 'More than 10', '1 - 2', '1 - 2', '1', '1 Dot'),
(150, 'c3d4e5f678901ab2', 7683, 2, 1, 'More than 10', '1 - 2', '1 - 2', '1', '2 Dots'),
(151, 'b2c3d4e5f678901a', 7683, 2, 1, 'More than 10', 'More than 2', '1 - 2', 'No Wickets', '2 Dots'),
(153, 'b2c3d4e5f678901a', 7683, 2, 2, 'More than 10', 'More than 2', 'More than 2', '1', '2 Dots'),
(154, 'dda1a440d0e5463b', 7683, 2, 2, '6 - 10', '1 - 2', 'More than 2', '1', '2 Dots'),
(155, 'e5f678901ab2c3d4', 7683, 2, 2, 'More than 10', '1 - 2', '1 - 2', 'No Wickets', '1 Dot'),
(158, 'd4e5f678901ab2c3', 7683, 2, 2, 'More than 10', 'No Four', 'No Sixes', '1', '2 Dots'),
(159, 'a1b2c3d4e5f67890', 7683, 2, 2, 'More than 10', '1 - 2', '1 - 2', NULL, NULL),
(161, 'c3d4e5f678901ab2', 7683, 2, 2, '6 - 10', '1 - 2', 'More than 2', '1', '2 Dots'),
(163, 'b2c3d4e5f678901a', 7683, 2, 3, 'More than 10', '1 - 2', 'More than 2', '1', '2 Dots'),
(164, 'b2c3d4e5f678901a', 7683, 2, 4, 'More than 10', 'More than 2', 'More than 2', 'More than 2', '3 Dots'),
(165, 'c3d4e5f678901ab2', 7683, 2, 4, '6 - 10', 'No Four', 'More than 2', '1', '2 Dots'),
(167, 'd4e5f678901ab2c3', 7683, 2, 4, '6 - 10', 'No Four', NULL, 'More than 2', '2 Dots'),
(168, 'b2c3d4e5f678901a', 7683, 2, 5, 'More than 10', 'No Four', 'More than 2', 'No Wickets', NULL),
(170, 'c3d4e5f678901ab2', 7683, 2, 5, 'More than 10', 'No Four', 'More than 2', 'No Wickets', NULL),
(172, 'b2c3d4e5f678901a', 7683, 2, 6, 'No Runs', 'No Four', 'No Sixes', 'No Wickets', 'More than 3'),
(173, 'dda1a440d0e5463b', 7683, 2, 6, '1 - 5', '1 - 2', '1 - 2', '2', NULL),
(174, 'dda1a440d0e5463b', 7683, 2, 7, '6 - 10', '1 - 2', '1 - 2', NULL, NULL);

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
  ADD UNIQUE KEY `unique_user_data` (`user_id`,`over_number`,`innings`);

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
  MODIFY `s_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=175;

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
