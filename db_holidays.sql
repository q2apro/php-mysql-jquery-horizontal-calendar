-- phpMyAdmin SQL Dump
-- version 4.7.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 03, 2018 at 06:19 AM
-- Server version: 5.7.21-0ubuntu0.16.04.1-log
-- PHP Version: 7.2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_holidays`
--

-- --------------------------------------------------------

--
-- Table structure for table `holiday_countries`
--

CREATE TABLE `holiday_countries` (
  `id` int(2) UNSIGNED NOT NULL,
  `country` varchar(3) NOT NULL,
  `region` varchar(80) NOT NULL,
  `meta` varchar(200) NOT NULL,
  `datasource` varchar(200) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `holiday_periods`
--

CREATE TABLE `holiday_periods` (
  `id` int(2) UNSIGNED NOT NULL DEFAULT '1' COMMENT 'regionid',
  `startdate` date NOT NULL,
  `enddate` date NOT NULL,
  `meta` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `holiday_countries`
--
ALTER TABLE `holiday_countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `holiday_periods`
--
ALTER TABLE `holiday_periods`
  ADD UNIQUE KEY `id` (`id`,`startdate`,`enddate`,`meta`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `holiday_countries`
--
ALTER TABLE `holiday_countries`
  MODIFY `id` int(2) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
