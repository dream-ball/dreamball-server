-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 18, 2025 at 07:15 AM
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
(888, 7773, '1', 100, 10, 12, 11, 10, 20, 'entry', 3, '{\"stage1\":\"1:25\",\"stage2\":\"2:15\",\"stage3\":\"3-8:10\"}', 'live'),
(889, 7773, '2', 16750, 99, 225, 224, 25, 5525, 'entry', 3, '{\"stage1\":\"1:700\",\"stage2\":\"2:800\",\"stage3\":\"3-4:500\",\"stage4\":\"5-6:300\",\"stage5\":\"7-25:225\",\"stage6\":\"26-50:175\",\"stage7\":\"51-100:80\"}', 'live'),
(890, 7773, '3', 126000, 75, 2000, 2000, 18, 24000, 'entry', 3, '{\"stage1\":\"1-420:300\"}', 'live'),
(891, 7773, '4', 810, 45, 21, 21, 18, 135, 'entry', 3, '{\"stage1\":\"1-9:90\"}', 'live'),
(892, 7773, '5', 0, 0, 20, 20, 0, 0, 'practice', 1, '{\"stage1\":\"1-20:0\"}', 'live'),
(893, 7863, '1', 100, 10, 12, 12, 10, 20, 'entry', 3, '{\"stage1\":\"1:25\",\"stage2\":\"2:15\",\"stage3\":\"3-8:10\"}', 'upcoming'),
(894, 7863, '2', 16750, 99, 225, 224, 25, 5525, 'entry', 3, '{\"stage1\":\"1:700\",\"stage2\":\"2:800\",\"stage3\":\"3-4:500\",\"stage4\":\"5-6:300\",\"stage5\":\"7-25:225\",\"stage6\":\"26-50:175\",\"stage7\":\"51-100:80\"}', 'upcoming'),
(895, 7863, '3', 126000, 75, 2000, 2000, 18, 24000, 'entry', 3, '{\"stage1\":\"1-420:300\"}', 'upcoming'),
(896, 7863, '4', 810, 45, 21, 21, 18, 135, 'entry', 3, '{\"stage1\":\"1-9:90\"}', 'upcoming'),
(897, 7863, '5', 0, 0, 20, 20, 0, 0, 'practice', 1, '{\"stage1\":\"1-20:0\"}', 'upcoming'),
(898, 7834, '1', 100, 10, 12, 5, 10, 20, 'entry', 3, '{\"stage1\":\"1:25\",\"stage2\":\"2:15\",\"stage3\":\"3-8:10\"}', 'live'),
(899, 7834, '2', 16750, 99, 225, 225, 25, 5525, 'entry', 3, '{\"stage1\":\"1:700\",\"stage2\":\"2:800\",\"stage3\":\"3-4:500\",\"stage4\":\"5-6:300\",\"stage5\":\"7-25:225\",\"stage6\":\"26-50:175\",\"stage7\":\"51-100:80\"}', 'live'),
(900, 7834, '3', 126000, 75, 2000, 2000, 18, 24000, 'entry', 3, '{\"stage1\":\"1-420:300\"}', 'live'),
(901, 7834, '4', 810, 45, 21, 21, 18, 135, 'entry', 3, '{\"stage1\":\"1-9:90\"}', 'live'),
(902, 7834, '5', 0, 0, 20, 20, 0, 0, 'practice', 1, '{\"stage1\":\"1-20:0\"}', 'live'),
(903, 7474, '1', 100, 10, 12, 11, 10, 20, 'entry', 3, '{\"stage1\":\"1:25\",\"stage2\":\"2:15\",\"stage3\":\"3-8:10\"}', 'upcoming'),
(904, 7474, '2', 16750, 99, 225, 224, 25, 5525, 'entry', 3, '{\"stage1\":\"1:700\",\"stage2\":\"2:800\",\"stage3\":\"3-4:500\",\"stage4\":\"5-6:300\",\"stage5\":\"7-25:225\",\"stage6\":\"26-50:175\",\"stage7\":\"51-100:80\"}', 'upcoming'),
(905, 7474, '3', 126000, 75, 2000, 2000, 18, 24000, 'entry', 3, '{\"stage1\":\"1-420:300\"}', 'upcoming'),
(906, 7474, '4', 810, 45, 21, 21, 18, 135, 'entry', 3, '{\"stage1\":\"1-9:90\"}', 'upcoming'),
(907, 7474, '5', 0, 0, 20, 20, 0, 0, 'practice', 1, '{\"stage1\":\"1-20:0\"}', 'upcoming');

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
(35068, 5761, 1, '1'),
(35069, 5761, 2, 'W'),
(35070, 5761, 3, '0'),
(35071, 5761, 4, '4'),
(35072, 5761, 5, '4'),
(35073, 5761, 6, '1'),
(35074, 5762, 1, '1LB'),
(35075, 5762, 2, '6'),
(35076, 5762, 3, '0'),
(35077, 5762, 4, '0'),
(35078, 5762, 5, '0'),
(35079, 5762, 6, '0'),
(35080, 5763, 1, '1'),
(35081, 5763, 2, 'W'),
(35082, 5763, 3, '0'),
(35083, 5763, 4, '4'),
(35084, 5763, 5, '4'),
(35085, 5763, 6, '1'),
(35086, 5764, 1, '0'),
(35087, 5764, 2, '0'),
(35088, 5764, 3, '0'),
(35089, 5764, 4, '1'),
(35090, 5764, 5, '1'),
(35091, 5764, 6, '6'),
(35092, 5765, 1, '0'),
(35093, 5765, 2, '4'),
(35094, 5765, 3, '0'),
(35095, 5765, 4, '3BYE'),
(35096, 5765, 5, '2BYE'),
(35097, 5765, 6, '3'),
(35098, 5765, 7, '0'),
(35099, 5765, 8, '1'),
(35100, 5766, 1, '1'),
(35101, 5766, 2, '1'),
(35102, 5766, 3, '0'),
(35103, 5766, 4, '4'),
(35104, 5766, 5, '1'),
(35105, 5766, 6, '4'),
(35106, 5767, 1, '1'),
(35107, 5767, 2, '1'),
(35108, 5767, 3, '0'),
(35109, 5767, 4, '0'),
(35110, 5767, 5, '1'),
(35111, 5767, 6, '0'),
(35112, 5767, 7, 'WB'),
(35113, 5768, 1, '1'),
(35114, 5768, 2, '1'),
(35115, 5768, 3, '0'),
(35116, 5768, 4, '0'),
(35117, 5768, 5, '0'),
(35118, 5768, 6, '1'),
(35119, 5769, 1, '0'),
(35120, 5769, 2, 'W'),
(35121, 5769, 3, '1'),
(35122, 5769, 4, '0'),
(35123, 5769, 5, '1'),
(35124, 5769, 6, '1'),
(35125, 5770, 1, '1'),
(35126, 5770, 2, '0'),
(35127, 5770, 3, '0'),
(35128, 5770, 4, '0'),
(35129, 5770, 5, '1'),
(35130, 5770, 6, 'W'),
(35131, 5771, 1, '1'),
(35132, 5771, 2, '0'),
(35133, 5771, 3, 'WB'),
(35134, 5771, 4, '0'),
(35135, 5771, 5, '4WB'),
(35136, 5771, 6, 'W'),
(35137, 5771, 7, '4'),
(35138, 5771, 8, '1LB'),
(35139, 5772, 1, '4'),
(35140, 5772, 2, '1'),
(35141, 5772, 3, '0'),
(35142, 5772, 4, '6'),
(35143, 5772, 5, '1'),
(35144, 5772, 6, '6'),
(35145, 5773, 1, '1'),
(35146, 5773, 2, '1'),
(35147, 5773, 3, '0'),
(35148, 5773, 4, 'W'),
(35149, 5773, 5, '1'),
(35150, 5773, 6, '0'),
(35151, 5773, 7, 'WB');

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
  `match_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`match_data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `live_match_data`
--

INSERT INTO `live_match_data` (`s_no`, `match_id`, `match_time`, `date_wise`, `live_time`, `match_data`) VALUES
(178, 7834, '04:30 PM', '15 Mar 2025, Saturday', '2025-03-15 16:45:18', '{\"team_b_id\":669,\"date_wise\":\"15 Mar 2025, Saturday\",\"max_rate\":\"0.00\",\"match_id\":7834,\"venue\":\"Lugogo Stadium, Kampala\",\"match_status\":\"Upcoming\",\"matchs\":\"4th Match\",\"venue_id\":231,\"series\":\"Uganda T20 League, 2025\",\"team_a_id\":666,\"match_date\":\"15-Mar\",\"team_a_img\":\"https://cricketchampion.co.in/webroot/img/teams/184410051_team.png\",\"min_rate\":\"0.00\",\"match_time\":\"04:30 PM\",\"match_type\":\"T20\",\"team_b_img\":\"https://cricketchampion.co.in/webroot/img/teams/20814494_team.png\",\"team_b_short\":\"RUBY\",\"team_b\":\"Ruby\",\"team_a_short\":\"SAP\",\"fav_team\":\"\",\"team_a\":\"Sapphire\",\"is_hundred\":1,\"series_id\":532,\"series_type\":\"Local\"}');

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
(187, 7474, '07:00 PM', '15 Mar 2025, Saturday', '{\"team_b_id\":584,\"date_wise\":\"15 Mar 2025, Saturday\",\"max_rate\":\"0.00\",\"match_id\":7474,\"venue\":\"Miraj International Cricket Stadium, Rajasthan\",\"match_status\":\"Upcoming\",\"matchs\":\"Qualifier 1\",\"venue_id\":224,\"series\":\"Asian Legends League 2025\",\"team_a_id\":383,\"match_date\":\"15-Mar\",\"team_a_img\":\"https://cricketchampion.co.in/webroot/img/teams/845876313_team.jpg\",\"min_rate\":\"0.00\",\"match_time\":\"07:00 PM\",\"match_type\":\"T20\",\"team_b_img\":\"https://cricketchampion.co.in/webroot/img/teams/1380153575_team.jpg\",\"team_b_short\":\"ANS\",\"team_b\":\"Asian Stars\",\"team_a_short\":\"IR\",\"fav_team\":\"\",\"team_a\":\"Indian Royals\",\"is_hundred\":1,\"series_id\":512,\"series_type\":\"League\"}'),
(185, 7863, '04:00 PM', '15 Mar 2025, Saturday', '{\"team_b_id\":642,\"date_wise\":\"15 Mar 2025, Saturday\",\"max_rate\":\"0.00\",\"match_id\":7863,\"venue\":\"Cartama Oval, Cartama\",\"match_status\":\"Upcoming\",\"matchs\":\"2nd  Match,Group G\",\"venue_id\":223,\"series\":\"European Cricket League, 2025\",\"team_a_id\":641,\"match_date\":\"15-Mar\",\"team_a_img\":\"https://cricketchampion.co.in/webroot/img/teams/356447082_team.png\",\"min_rate\":\"0.00\",\"match_time\":\"04:00 PM\",\"match_type\":\"T10\",\"team_b_img\":\"https://cricketchampion.co.in/webroot/img/teams/338012839_team.png\",\"team_b_short\":\"MTK\",\"team_b\":\"Mediterranean Vikings\",\"team_a_short\":\"MAL\",\"fav_team\":\"\",\"team_a\":\"Malo\",\"is_hundred\":1,\"series_id\":515,\"series_type\":\"Local\"}');

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

--
-- Dumping data for table `open_overs`
--

INSERT INTO `open_overs` (`s_no`, `match_id`, `innings`, `over_number`) VALUES
(4, 7773, 1, 1),
(5, 7834, 2, 1);

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
(5761, 7834, 1, 13, 'Musa Majid', 10, '91-5', 1, 'RUBY'),
(5762, 7834, 1, 3, 'Henry Ssenyondo', 7, '16-1', 0, 'RUBY'),
(5763, 7834, 1, 12, 'Musa Majid', 10, '91-5', 1, 'RUBY'),
(5764, 7834, 1, 11, 'Calvin Watuwa', 8, '81-4', 0, 'RUBY'),
(5765, 7834, 1, 10, 'Gurjivan Singh', 13, '73-4', 0, 'RUBY'),
(5766, 7834, 1, 7, 'Gurjivan Singh', 11, '59-3', 0, 'RUBY'),
(5767, 7834, 1, 2, 'Kakaire Geafrey', 4, '8-1', 0, 'RUBY'),
(5768, 7834, 1, 9, 'Pius Oloka', 3, '65-4', 0, 'RUBY'),
(5769, 7834, 1, 8, 'Kakaire Geafrey', 3, '62-4', 1, 'RUBY'),
(5770, 7834, 1, 6, 'Henry Ssenyondo', 2, '48-3', 1, 'RUBY'),
(5771, 7834, 1, 5, 'Pius Oloka', 12, '46-2', 1, 'RUBY'),
(5772, 7834, 1, 4, 'Musa Majid', 18, '34-1', 0, 'RUBY'),
(5773, 7834, 1, 1, 'Musa Majid', 4, '4-1', 1, 'RUBY');

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
(122, 'dda1a440d0e5463b', 7863, 2, 99, 'upcoming', 0, '2025-03-17 05:04:36'),
(125, 'a1b2c3d4e5f67890', 7834, 1, 10, 'live', -3, '2025-03-18 01:04:02'),
(126, 'b2c3d4e5f678901a', 7834, 1, 10, 'live', -5, '2025-03-18 01:04:11'),
(127, 'c3d4e5f678901ab2', 7834, 1, 10, 'live', -1, '2025-03-18 01:04:19'),
(128, 'd4e5f678901ab2c3', 7834, 1, 10, 'live', 1, '2025-03-18 01:04:59'),
(129, 'e5f678901ab2c3d4', 7834, 1, 10, 'live', 1, '2025-03-18 01:04:39'),
(130, 'dda1a440d0e5463b', 7834, 1, 10, 'live', 3, '2025-03-17 01:14:47');

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

CREATE TABLE `user_details` (
  `user_id` varchar(255) NOT NULL,
  `mail_id` varchar(255) NOT NULL,
  `user_name` varchar(15) DEFAULT NULL,
  `user_token` varchar(255) NOT NULL,
  `user_profile` longtext NOT NULL DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&s',
  `funds` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_details`
--

INSERT INTO `user_details` (`user_id`, `mail_id`, `user_name`, `user_token`, `user_profile`, `funds`) VALUES
('a1b2c3d4e5f67890', 'user1@example.com', 'user_one', 'token_abc123', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&s', 50000),
('b2c3d4e5f678901a', 'user2@example.com', 'user_two', 'token_xyz456', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&s', 75000),
('c3d4e5f678901ab2', 'user3@example.com', 'user_three', 'token_pqr789', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&s', 32000),
('d4e5f678901ab2c3', 'user4@example.com', 'user_four', 'token_def456', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&s', 88000),
('dda1a440d0e5463b', 'test@123', 'vignesh', 'test123', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&s', 92628),
('e5f678901ab2c3d4', 'user5@example.com', 'user_five', 'token_ghi789', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTtYlMT_y-EHdA3AHXBo3PNPDApVNmmbAKSQ&s', 65000);

-- --------------------------------------------------------

--
-- Table structure for table `user_kyc`
--

CREATE TABLE `user_kyc` (
  `s_no` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `age` int(11) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `aadhaar_number` int(12) NOT NULL,
  `pan_number` varchar(20) NOT NULL,
  `aadhaar_front_image` longtext NOT NULL,
  `aadhaar_back_image` longtext NOT NULL,
  `pan_image` longtext NOT NULL
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
(90, 'dda1a440d0e5463b', 7834, 1, 1, '1 - 5', 'No Four', 'No Sixes', '1', '1 Dot'),
(93, 'a1b2c3d4e5f67890', 7834, 1, 1, '6 - 10', '1 - 2', 'More than 2', '2', '2 Dots'),
(94, 'b2c3d4e5f678901a', 7834, 1, 1, 'More than 10', 'More than 2', '1 - 2', 'More than 2', '3 Dots'),
(95, 'c3d4e5f678901ab2', 7834, 1, 1, 'No Runs', 'No Four', 'No Sixes', 'No Wickets', 'More than 3'),
(96, 'd4e5f678901ab2c3', 7834, 1, 1, '1 - 5', '1 - 2', 'No Sixes', '1', '1 Dot'),
(97, 'e5f678901ab2c3d4', 7834, 1, 1, '6 - 10', 'More than 2', 'More than 2', '2', '2 Dots');

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
  MODIFY `s_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=908;

--
-- AUTO_INCREMENT for table `deliveries`
--
ALTER TABLE `deliveries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35158;

--
-- AUTO_INCREMENT for table `live_match_data`
--
ALTER TABLE `live_match_data`
  MODIFY `s_no` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=179;

--
-- AUTO_INCREMENT for table `matches`
--
ALTER TABLE `matches`
  MODIFY `s_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=188;

--
-- AUTO_INCREMENT for table `open_overs`
--
ALTER TABLE `open_overs`
  MODIFY `s_no` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `overs`
--
ALTER TABLE `overs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5775;

--
-- AUTO_INCREMENT for table `registered_contest`
--
ALTER TABLE `registered_contest`
  MODIFY `s_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT for table `user_kyc`
--
ALTER TABLE `user_kyc`
  MODIFY `s_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user_over_data`
--
ALTER TABLE `user_over_data`
  MODIFY `s_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

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
