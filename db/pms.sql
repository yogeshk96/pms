-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jun 10, 2015 at 11:45 AM
-- Server version: 5.6.20
-- PHP Version: 5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `pms`
--

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE IF NOT EXISTS `companies` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `activation` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `created_at`, `updated_at`, `name`, `activation`) VALUES
(1, '2015-05-20 06:18:34', '2015-05-20 06:18:34', 'Admin', 1),
(2, '2015-05-20 06:18:34', '2015-05-20 06:18:34', 'SSE', 1);

-- --------------------------------------------------------

--
-- Table structure for table `company_transactions`
--

CREATE TABLE IF NOT EXISTS `company_transactions` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `company_id` int(10) unsigned NOT NULL,
  `type` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `expiry` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `data_refreshes`
--

CREATE TABLE IF NOT EXISTS `data_refreshes` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `changed` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `document_types`
--

CREATE TABLE IF NOT EXISTS `document_types` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `doctype` int(11) NOT NULL DEFAULT '0',
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Dumping data for table `document_types`
--

INSERT INTO `document_types` (`id`, `created_at`, `updated_at`, `doctype`, `name`) VALUES
(1, '2015-05-20 06:18:44', '2015-05-20 06:18:44', 1, 'Delivery Challan'),
(2, '2015-05-20 06:18:45', '2015-05-20 06:18:45', 2, 'Contract Agreement');

-- --------------------------------------------------------

--
-- Table structure for table `material_category`
--

CREATE TABLE IF NOT EXISTS `material_category` (
`id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `name` varchar(200) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `material_category`
--

INSERT INTO `material_category` (`id`, `created_at`, `updated_at`, `name`) VALUES
(1, '2015-05-21 08:37:07', '0000-00-00 00:00:00', 'Transformer'),
(2, '2015-05-21 08:37:13', '0000-00-00 00:00:00', 'Poles');

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE IF NOT EXISTS `menus` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `module_id` int(10) unsigned NOT NULL,
  `role` int(11) NOT NULL,
  `menu` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `sidebar_itemname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `priority` int(11) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=20 ;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `created_at`, `updated_at`, `module_id`, `role`, `menu`, `slug`, `sidebar_itemname`, `priority`) VALUES
(3, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 6, 5, 'Inventory Management', 'inventorymanagement.stockinventory', 'inventorymanagement', 1),
(4, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 6, 5, 'Reports', 'reports.reconciliation', 'reports', 2),
(6, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 6, 5, 'Add a Material Type', 'addmaterialtype', 'addmaterialtype', 3),
(7, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 6, 5, 'Add Third Party', 'addthirdparty', 'addthirdparty', 5),
(8, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 7, 6, 'Vendor Registration', 'vendorregistration', 'vendorregistration', 1),
(9, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 7, 6, 'Send Enquiry', 'sendenquiry', 'sendenquiry', 2),
(10, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 7, 6, 'Raise Purchase Order', 'raisepurchaseorder', 'raisepurchaseorder', 3),
(11, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 8, 7, 'Client Billing', 'clientbilling', 'clientbilling', 1),
(12, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 8, 7, 'Sub Contractor Billing', 'subcontractorbilling', 'subcontractorbilling', 2),
(13, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 8, 7, 'Recovery', 'recovery', 'recovery', 3),
(14, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 6, 5, 'BOQ, BOM Mapping', 'boqbommapping', 'boqbommapping', 4),
(15, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 6, 5, 'Add Inhouse Vendor', 'addinhousevendor', 'addinhousevendor', 5),
(16, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 3, 1, 'Create User', 'createuser', 'createuser', 1),
(17, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 3, 1, 'Edit Users', 'editusers', 'editusers', 2),
(18, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 3, 1, 'Assign Work IDs', 'assignworkids.hvds', 'assignworkids', 4),
(19, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 3, 1, 'Create Project', 'createproject.create', 'createproject', 3);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE IF NOT EXISTS `migrations` (
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`migration`, `batch`) VALUES
('2015_05_05_114619_create_companies_table', 1),
('2015_05_05_114620_create_user_roles_table', 1),
('2015_05_05_114629_create_users_table', 1),
('2015_05_05_114723_create_stores_table', 1),
('2015_05_05_114756_create_sessions_table', 1),
('2015_05_05_114805_create_passwords_table', 1),
('2015_05_05_114827_create_queries_table', 1),
('2015_05_05_114837_create_news_table', 1),
('2015_05_05_114850_create_company_transactions_table', 1),
('2015_05_05_114854_create_subscriptions_table', 1),
('2015_05_05_114916_create_store_materials_table', 1),
('2015_05_05_114920_create_store_addons_table', 1),
('2015_05_05_114924_create_store_stocks_table', 1),
('2015_05_05_114955_create_store_transactions_table', 1),
('2015_05_05_114956_create_store_transaction_datas_table', 1),
('2015_05_05_114960_create_document_types_table', 1),
('2015_05_05_115156_create_projects_table', 1),
('2015_05_05_115205_create_project_documents_table', 1),
('2015_05_05_115533_create_works_table', 1),
('2015_05_05_115703_create_work_divisions_table', 1),
('2015_05_05_115704_create_work_ids_table', 1),
('2015_05_05_115710_create_sites_table', 1),
('2015_05_05_115720_create_site_materials_table', 1),
('2015_05_05_115721_create_store_datas_table', 1),
('2015_05_05_115722_create_store_documents_table', 1),
('2015_05_05_115737_create_site_attendances_table', 1),
('2015_05_05_115803_create_work_progresses_table', 1),
('2015_05_05_115822_create_site_items_table', 1),
('2015_05_05_115830_create_site_item_details_table', 1),
('2015_05_05_115840_create_site_item_descrs_table', 1),
('2015_05_05_115936_create_surveys_table', 1),
('2015_05_05_115955_create_survey_datas_table', 1),
('2015_05_05_120015_create_survey_item_details_table', 1),
('2015_05_05_120226_create_data_refreshes_table', 1),
('2015_05_19_065810_create_site_transactions_table', 1),
('2015_05_19_065829_create_site_transaction_datas_table', 1),
('2015_05_19_093026_create_work_types_table', 1),
('2015_05_20_050951_create_modules_table', 1),
('2015_05_20_051015_create_menus_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE IF NOT EXISTS `modules` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `role` int(11) NOT NULL,
  `module` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `color` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `icon` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `priority` int(11) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=9 ;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `created_at`, `updated_at`, `role`, `module`, `color`, `icon`, `slug`, `priority`) VALUES
(3, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'Admin', '#9b59b6', 'fa fa-user-plus', 'admin', 1),
(6, '2015-05-19 18:30:00', '2015-05-19 18:30:00', 5, 'Warehouse', '#e67e22', 'fa fa-home', 'warehouse', 1),
(7, '2015-05-19 18:30:00', '2015-05-19 18:30:00', 6, 'Purchases', '#e67e22', 'fa fa-home', 'purchases', 1),
(8, '2015-05-19 18:30:00', '2015-05-19 18:30:00', 7, 'Billing', '#e67e22', 'fa fa-home', 'billing', 1);

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE IF NOT EXISTS `news` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_id` int(10) unsigned NOT NULL,
  `heading` text COLLATE utf8_unicode_ci NOT NULL,
  `content` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `passwords`
--

CREATE TABLE IF NOT EXISTS `passwords` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_id` int(10) unsigned NOT NULL,
  `oldpassword` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `newpassword` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE IF NOT EXISTS `projects` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `company_id` int(10) unsigned NOT NULL,
  `created_by` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `projectcode` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `activation` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `project_documents`
--

CREATE TABLE IF NOT EXISTS `project_documents` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `doctype` int(11) NOT NULL DEFAULT '0',
  `docpath` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `project_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `queries`
--

CREATE TABLE IF NOT EXISTS `queries` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_id` int(10) unsigned NOT NULL,
  `resolved_by` int(10) unsigned NOT NULL,
  `query` text COLLATE utf8_unicode_ci NOT NULL,
  `answer` text COLLATE utf8_unicode_ci NOT NULL,
  `phoneno` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_id` int(10) unsigned NOT NULL,
  `login_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `expiry_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `refreshtoken` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=50 ;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `created_at`, `updated_at`, `user_id`, `login_time`, `expiry_time`, `refreshtoken`) VALUES
(1, '2015-05-20 06:57:55', '2015-05-20 06:57:55', 2, '2015-05-20 06:57:55', '2015-05-20 09:57:55', '94ac4f28c7f690bd8733aef0e999f5c45e3561502d38e381301371860f4fec67'),
(2, '2015-05-20 07:05:00', '2015-05-20 07:05:00', 2, '2015-05-20 07:05:00', '2015-05-20 10:05:00', '457ed4c64bbaea3ceed661444dbd86d1a6015e4405ce67015b1a7e0bf8a413fa'),
(3, '2015-05-20 10:12:02', '2015-05-20 10:12:02', 2, '2015-05-20 10:12:02', '2015-05-20 13:12:02', '3710ba7b356a86fc5d1100fd8e9b5c480af0eb48180e6c2be7c4388b247544e7'),
(4, '2015-05-20 10:55:11', '2015-05-20 10:55:11', 2, '2015-05-20 10:55:11', '2015-05-20 13:55:11', '61a34309b2d0876a39b7aac8f4d93b1440023193b73462e400bf1f7fe8a3cff8'),
(5, '2015-05-21 06:51:51', '2015-05-21 06:51:51', 2, '2015-05-21 06:51:50', '2015-05-21 09:51:51', '974ec5dd5526127ba46f4335cf644abe8b381c2576032442bb5e11f9fc12fbd3'),
(6, '2015-05-21 07:17:46', '2015-05-21 07:17:46', 4, '2015-05-21 07:17:46', '2015-05-21 10:17:46', 'd3c229f03dde07e7cc88e01bd83011f051b64b05d3f4d9fc5f2a628580c70210'),
(7, '2015-05-21 07:52:28', '2015-05-21 07:52:28', 4, '2015-05-21 07:52:28', '2015-05-21 10:52:28', '8cadfad80a36f5b3c5ed4579932a47831b88e612c99691cb9ef616f1886deedc'),
(8, '2015-05-21 07:52:49', '2015-05-21 07:52:49', 2, '2015-05-21 07:52:49', '2015-05-21 10:52:49', '49497de4c40c20f4a48fb0831453550c2ea79aa325543fabea7b423da8c2ef27'),
(9, '2015-05-21 10:14:25', '2015-05-21 10:14:25', 4, '2015-05-21 10:14:25', '2015-05-21 13:14:25', '391633b29856d45f0b3ad50e694b7c24952f136ad900630efb86fd7db0b331ce'),
(10, '2015-05-21 14:22:53', '2015-05-21 16:36:41', 4, '2015-05-21 14:22:53', '2015-05-21 19:36:41', '99ec3d47eb356c18f0b675b5e579b22b69730d720c00dd3fca974e05e0e38bac'),
(11, '2015-05-22 05:32:42', '2015-05-22 08:27:58', 4, '2015-05-22 05:32:42', '2015-05-22 11:27:58', 'fa22796446ef6b1aeb9738a8cc4affa00d1641a14c1da67938154d5d37432c13'),
(12, '2015-05-22 08:28:15', '2015-05-22 08:34:26', 2, '2015-05-22 08:28:15', '2015-05-22 11:34:26', 'f124c5d00041fdc575b5f2ce5cee7fdf65e6707adeba98b363cb48027537431e'),
(13, '2015-05-22 08:41:24', '2015-05-22 12:18:56', 4, '2015-05-22 08:41:23', '2015-05-22 15:18:56', 'de01fd9a36002973607f1d5697d9a675d6094e13b2de864b5a678ed0eaf2be45'),
(14, '2015-05-23 03:28:03', '2015-05-23 05:10:09', 2, '2015-05-23 03:28:03', '2015-05-23 08:10:09', 'cf13273d630b14f007883b3906c6ec51fbf31f43722b80cc3f32e559f6c0edcf'),
(15, '2015-05-23 05:11:12', '2015-05-23 06:07:11', 4, '2015-05-23 05:11:12', '2015-05-23 09:07:11', 'c6eb75816dd1da149206378ca2d29b7e9f76e01c2a89eb5f7bd6756be4f85ee6'),
(16, '2015-05-23 05:43:50', '2015-05-23 05:46:12', 4, '2015-05-23 05:43:50', '2015-05-23 08:46:12', 'bfd853610de46730dd2b79310e572ed35744433ecd7162d4eaac4afdf82bdba9'),
(17, '2015-05-25 10:08:23', '2015-05-25 10:29:31', 4, '2015-05-25 10:08:23', '2015-05-25 13:29:31', '6654e31da596ec5b90aea94d54c333053c1a7bc2bbef280dda862682136f2178'),
(18, '2015-05-26 10:46:46', '2015-05-26 10:47:03', 4, '2015-05-26 10:46:46', '2015-05-26 13:47:03', '4890e4a7c446dd4e7683cbe87ba19bd24cbc39ead3a55e1d6bd68592481e8349'),
(19, '2015-05-26 10:49:00', '2015-05-26 17:47:48', 4, '2015-05-26 10:49:00', '2015-05-26 20:47:48', 'c0b2d9db489b39659e5fe1d45df53159d2d1f238595151fdf8122f5ddd90c02b'),
(20, '2015-05-27 00:41:23', '2015-05-27 01:26:50', 4, '2015-05-27 00:41:23', '2015-05-27 04:26:50', 'd8bf8dee939cf46de3668102822d772c4caecc5ade8560dbbb8d47c2fffee0b7'),
(21, '2015-05-27 05:07:08', '2015-05-27 06:53:20', 4, '2015-05-27 05:07:08', '2015-05-27 09:53:20', '722d15539463fc1e647d23d8ba314b1ea5ecb9aad408cfd5443cdf0844289d0b'),
(22, '2015-05-27 09:45:37', '2015-05-27 13:42:44', 4, '2015-05-27 09:45:36', '2015-05-27 16:42:44', 'e4a7c709797f3aaa7aad074055e1912addac8ed54bee4d668be542c4dfb83211'),
(23, '2015-05-28 03:23:02', '2015-05-28 04:30:20', 4, '2015-05-28 03:23:02', '2015-05-28 07:30:20', 'b64ee4178ea95091e8d9f2e76bc9d945c051c5a1fc95336572445221e2cf616d'),
(24, '2015-05-29 12:12:17', '2015-05-29 12:56:58', 4, '2015-05-29 12:12:14', '2015-05-29 15:56:58', '3011858f8e0311b3b378f5b879aef2c0520e5a23cf1c79d7d43b93ba7814ab69'),
(25, '2015-05-30 08:49:00', '2015-05-30 11:23:06', 4, '2015-05-30 08:49:00', '2015-05-30 14:23:06', 'cc0fb36b1ef85470e9abe428b09857d7e4d66f51518dd2d07985398c8431a641'),
(26, '2015-05-30 11:23:23', '2015-05-30 11:24:29', 4, '2015-05-30 11:23:23', '2015-05-30 14:24:29', 'a5d2b375ec23bf30b17077b87d620976170f9c64f0cb59f203d17840e4190ffe'),
(27, '2015-06-04 11:46:12', '2015-06-04 11:46:13', 4, '2015-06-04 11:46:11', '2015-06-04 14:46:13', '00d09493197296e595dffb4aba8548f0fb0e05112cf4dcb4b69d75eb1dea4d2c'),
(28, '2015-06-04 12:07:27', '2015-06-04 12:08:04', 4, '2015-06-04 12:07:27', '2015-06-04 15:08:04', 'e2f3ed440cf374c16b715602b00fd9b71be775fbcb9d6eef59cc61fe445e4c3f'),
(29, '2015-06-04 12:25:52', '2015-06-04 13:25:47', 4, '2015-06-04 12:25:52', '2015-06-04 16:25:47', '2328252549ca4c69f07344a4d8e6095d028067e69c96c62d99c736617aef4a0a'),
(30, '2015-06-04 18:40:52', '2015-06-04 19:05:57', 5, '2015-06-04 18:40:52', '2015-06-04 22:05:57', '5a0140128313dc5c7583d9924fc4700bbed5e3fb96d5cfe8112bdf550bd998d5'),
(31, '2015-06-05 01:34:26', '2015-06-05 02:38:00', 5, '2015-06-05 01:34:26', '2015-06-05 05:38:00', '7a6db2ad7572a100b4aa8200a03ad0cfafdc891b7750f6aa2e6bc26ba32921bb'),
(32, '2015-06-05 09:45:10', '2015-06-05 09:45:17', 5, '2015-06-05 09:45:10', '2015-06-05 12:45:17', 'd47002e594fa1e65d283da6430baec6ded0885c0d5fc414790544609186beb6c'),
(33, '2015-06-05 09:58:31', '2015-06-05 14:15:08', 7, '2015-06-05 09:58:31', '2015-06-05 17:15:08', '1d4b380019f3676ce7d95ccf7b881f6d3f3895fc009eaf2940b8e40ff804fb9c'),
(34, '2015-06-05 14:17:09', '2015-06-05 14:22:06', 4, '2015-06-05 14:17:09', '2015-06-05 17:22:06', '3ab374ceff2ebe012c45de693918cfe903415aea8f1b7f2fee94d73345080f17'),
(35, '2015-06-05 14:22:34', '2015-06-05 15:49:37', 7, '2015-06-05 14:22:34', '2015-06-05 18:49:37', '7a6eb415ffb49efc8dd98669c4757f6c1777c36ab0229f87e19f5b810f94dc20'),
(36, '2015-06-05 15:52:03', '2015-06-05 15:54:46', 5, '2015-06-05 15:52:03', '2015-06-05 18:54:46', '7427d560596903f4f4fde5090581a8ea834bdf9ee88c2ddd6d263363242afcdb'),
(37, '2015-06-05 15:56:59', '2015-06-05 15:57:31', 7, '2015-06-05 15:56:59', '2015-06-05 18:57:31', 'a77333fe88623a507f999bc2b2fbd69d7ca9bc08455a599c92cd616e5a5f6dbb'),
(38, '2015-06-06 03:48:00', '2015-06-06 03:48:02', 7, '2015-06-06 03:48:00', '2015-06-06 06:48:02', 'adf571519e3da84af2cda798d2765c8448895dc21e246d30e9bd65b2c3328b54'),
(39, '2015-06-06 07:59:56', '2015-06-06 08:00:01', 5, '2015-06-06 07:59:55', '2015-06-06 11:00:01', '1189fa8124822af2d7d002d99d87ed4d7e4f38220daf4a579b452975b8158241'),
(40, '2015-06-06 08:03:05', '2015-06-06 08:03:10', 7, '2015-06-06 08:03:05', '2015-06-06 11:03:10', 'd1c6679adbd7a0569136b91d64d3b5c3e23b4792b541324d1234ffd5190ca20a'),
(41, '2015-06-06 08:07:52', '2015-06-06 08:18:37', 4, '2015-06-06 08:07:52', '2015-06-06 11:18:37', '73419255676cc599d913a21f193b00ce18f8c930e205b94418448b23afe1e047'),
(42, '2015-06-06 13:00:33', '2015-06-06 16:12:56', 4, '2015-06-06 13:00:33', '2015-06-06 19:12:56', 'aed4f5344c7adebc21e847afbcd8afb67395c381146ad3a8ff6d877c53696500'),
(43, '2015-06-07 10:38:19', '2015-06-07 10:38:34', 4, '2015-06-07 10:38:19', '2015-06-07 13:38:34', 'c775e3b5f7fb5f5db06d681d1318cf49d81805ccd9ae51d81ebbdcfe210a474f'),
(44, '2015-06-08 03:45:06', '2015-06-08 04:15:44', 2, '2015-06-08 03:45:06', '2015-06-08 07:15:44', '5dd0788536e3bdeac7fd227bf4f4def4916fe2fd97762a22beef20fe29f4ce1f'),
(45, '2015-06-08 11:27:57', '2015-06-08 16:17:39', 2, '2015-06-08 11:27:56', '2015-06-08 19:17:39', 'b60e577145e5edba6e794da891d239f38d060d8c45de7443462f8f66ce4743ef'),
(46, '2015-06-09 08:03:28', '2015-06-09 08:03:31', 2, '2015-06-09 08:03:28', '2015-06-09 11:03:31', '7448614d6bff3d31ffe70fc14b7fa25df683054765db93e6b5dc65dcf28d49df'),
(47, '2015-06-09 11:21:41', '2015-06-09 11:22:10', 2, '2015-06-09 11:21:41', '2015-06-09 14:22:10', '565e6dd670cda4413742e03f7d5956be638b5105a9928002ea9c6a23880f6a20'),
(48, '2015-06-09 11:24:03', '2015-06-09 11:24:04', 4, '2015-06-09 11:24:03', '2015-06-09 14:24:04', '93f59fe316dad43301653ce8284e62046452303f575f5c197a8baabebe3d2d55'),
(49, '2015-06-09 11:24:22', '2015-06-09 11:42:04', 4, '2015-06-09 11:24:21', '2015-06-09 14:42:04', '4f38c4454d90f1fa31addb423ce00063a5281dea8b06fd812b728b26cb23bdf9');

-- --------------------------------------------------------

--
-- Table structure for table `sites`
--

CREATE TABLE IF NOT EXISTS `sites` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `work_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `survey_user` int(10) unsigned NOT NULL,
  `mdtrcode` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `location` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `division` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `subdivision` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `section` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `substation` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `feeder` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `company` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `site_attendances`
--

CREATE TABLE IF NOT EXISTS `site_attendances` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `site_id` int(10) unsigned NOT NULL,
  `attendance` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `site_items`
--

CREATE TABLE IF NOT EXISTS `site_items` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `itemtype` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  `icon` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `badicon` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `activation` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=4 ;

--
-- Dumping data for table `site_items`
--

INSERT INTO `site_items` (`id`, `created_at`, `updated_at`, `name`, `itemtype`, `icon`, `badicon`, `activation`) VALUES
(1, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 'MDTR', '1', '', '', 1),
(2, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 'LT POLE', '1', '', '', 1),
(3, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 'SERVICE', '1', '', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `site_item_descrs`
--

CREATE TABLE IF NOT EXISTS `site_item_descrs` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `itemdata_id` int(10) unsigned NOT NULL,
  `response` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=135 ;

--
-- Dumping data for table `site_item_descrs`
--

INSERT INTO `site_item_descrs` (`id`, `created_at`, `updated_at`, `itemdata_id`, `response`) VALUES
(1, '2015-05-20 06:18:47', '2015-05-20 06:18:47', 3, 'Yes'),
(2, '2015-05-20 06:18:47', '2015-05-20 06:18:47', 3, 'No'),
(3, '2015-05-20 06:18:48', '2015-05-20 06:18:48', 4, 'Pole'),
(4, '2015-05-20 06:18:48', '2015-05-20 06:18:48', 4, 'Plinth'),
(5, '2015-05-20 06:18:49', '2015-05-20 06:18:49', 5, '0'),
(6, '2015-05-20 06:18:49', '2015-05-20 06:18:49', 5, '1'),
(7, '2015-05-20 06:18:49', '2015-05-20 06:18:49', 5, '2'),
(8, '2015-05-20 06:18:49', '2015-05-20 06:18:49', 5, '3'),
(9, '2015-05-20 06:18:50', '2015-05-20 06:18:50', 5, '4'),
(10, '2015-05-20 06:18:50', '2015-05-20 06:18:50', 5, '5'),
(11, '2015-05-20 06:18:51', '2015-05-20 06:18:51', 5, '5'),
(12, '2015-05-20 06:18:51', '2015-05-20 06:18:51', 5, '7'),
(13, '2015-05-20 06:18:51', '2015-05-20 06:18:51', 5, '8'),
(14, '2015-05-20 06:18:51', '2015-05-20 06:18:51', 5, '9'),
(15, '2015-05-20 06:18:52', '2015-05-20 06:18:52', 5, '10'),
(16, '2015-05-20 06:18:52', '2015-05-20 06:18:52', 6, '0'),
(17, '2015-05-20 06:18:52', '2015-05-20 06:18:52', 6, '1'),
(18, '2015-05-20 06:18:52', '2015-05-20 06:18:52', 6, '2'),
(19, '2015-05-20 06:18:53', '2015-05-20 06:18:53', 6, '3'),
(20, '2015-05-20 06:18:53', '2015-05-20 06:18:53', 6, '4'),
(21, '2015-05-20 06:18:53', '2015-05-20 06:18:53', 6, '5'),
(22, '2015-05-20 06:18:53', '2015-05-20 06:18:53', 6, '6'),
(23, '2015-05-20 06:18:54', '2015-05-20 06:18:54', 6, '7'),
(24, '2015-05-20 06:18:54', '2015-05-20 06:18:54', 6, '8'),
(25, '2015-05-20 06:18:54', '2015-05-20 06:18:54', 6, '9'),
(26, '2015-05-20 06:18:54', '2015-05-20 06:18:54', 6, '10'),
(27, '2015-05-20 06:18:55', '2015-05-20 06:18:55', 7, '0'),
(28, '2015-05-20 06:18:55', '2015-05-20 06:18:55', 7, '1'),
(29, '2015-05-20 06:18:55', '2015-05-20 06:18:55', 7, '2'),
(30, '2015-05-20 06:18:55', '2015-05-20 06:18:55', 7, '3'),
(31, '2015-05-20 06:18:56', '2015-05-20 06:18:56', 7, '4'),
(32, '2015-05-20 06:18:56', '2015-05-20 06:18:56', 7, '5'),
(33, '2015-05-20 06:18:56', '2015-05-20 06:18:56', 7, '6'),
(34, '2015-05-20 06:18:56', '2015-05-20 06:18:56', 7, '7'),
(35, '2015-05-20 06:18:57', '2015-05-20 06:18:57', 7, '8'),
(36, '2015-05-20 06:18:57', '2015-05-20 06:18:57', 7, '9'),
(37, '2015-05-20 06:18:57', '2015-05-20 06:18:57', 7, '10'),
(38, '2015-05-20 06:18:57', '2015-05-20 06:18:57', 8, 'Yes'),
(39, '2015-05-20 06:18:58', '2015-05-20 06:18:58', 8, 'No'),
(40, '2015-05-20 06:18:58', '2015-05-20 06:18:58', 9, 'Yes'),
(41, '2015-05-20 06:18:58', '2015-05-20 06:18:58', 9, 'No'),
(42, '2015-05-20 06:18:58', '2015-05-20 06:18:58', 11, 'Iron'),
(43, '2015-05-20 06:18:58', '2015-05-20 06:18:58', 11, 'Pscc'),
(44, '2015-05-20 06:19:00', '2015-05-20 06:19:00', 12, '0'),
(45, '2015-05-20 06:19:00', '2015-05-20 06:19:00', 12, '1'),
(46, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 12, '2'),
(47, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 12, '3'),
(48, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 12, '4'),
(49, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 12, '5'),
(50, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 12, '6'),
(51, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 12, '7'),
(52, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 12, '8'),
(53, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 12, '9'),
(54, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 12, '10'),
(55, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 13, '0'),
(56, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 13, '1'),
(57, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 13, '2'),
(58, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 13, '3'),
(59, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 13, '4'),
(60, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 13, '5'),
(61, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 13, '6'),
(62, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 13, '7'),
(63, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 13, '8'),
(64, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 13, '9'),
(65, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 13, '10'),
(66, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 14, '0'),
(67, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 14, '1'),
(68, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 14, '2'),
(69, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 14, '3'),
(70, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 14, '4'),
(71, '2015-05-20 06:19:01', '2015-05-20 06:19:01', 14, '5'),
(72, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 14, '6'),
(73, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 14, '7'),
(74, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 14, '8'),
(75, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 14, '9'),
(76, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 14, '10'),
(77, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 15, '0'),
(78, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 15, '1'),
(79, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 15, '2'),
(80, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 15, '3'),
(81, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 15, '4'),
(82, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 15, '5'),
(83, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 15, '6'),
(84, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 15, '7'),
(85, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 15, '8'),
(86, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 15, '9'),
(87, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 15, '10'),
(88, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 16, '0'),
(89, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 16, '1'),
(90, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 16, '2'),
(91, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 16, '3'),
(92, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 16, '4'),
(93, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 16, '5'),
(94, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 16, '6'),
(95, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 16, '7'),
(96, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 16, '8'),
(97, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 16, '9'),
(98, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 16, '10'),
(99, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 17, '0'),
(100, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 17, '1'),
(101, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 17, '2'),
(102, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 17, '3'),
(103, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 17, '4'),
(104, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 17, '5'),
(105, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 17, '6'),
(106, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 17, '7'),
(107, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 17, '8'),
(108, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 17, '9'),
(109, '2015-05-20 06:19:02', '2015-05-20 06:19:02', 17, '10'),
(110, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 20, '0'),
(111, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 20, '1'),
(112, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 20, '2'),
(113, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 20, '3'),
(114, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 20, '4'),
(115, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 20, '5'),
(116, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 20, '6'),
(117, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 20, '7'),
(118, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 20, '8'),
(119, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 20, '9'),
(120, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 20, '10'),
(121, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 18, '8'),
(122, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 18, '9.1'),
(123, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 17, 'Good'),
(124, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 17, 'Bad'),
(125, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 21, 'Yes'),
(126, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 21, 'No'),
(127, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 22, 'LT Line'),
(128, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 22, 'AB Cable'),
(129, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 23, 'Good'),
(130, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 23, 'Bad'),
(131, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 24, 'Yes'),
(132, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 24, 'No'),
(133, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 28, 'Yes'),
(134, '2015-05-20 06:19:03', '2015-05-20 06:19:03', 28, 'No');

-- --------------------------------------------------------

--
-- Table structure for table `site_item_details`
--

CREATE TABLE IF NOT EXISTS `site_item_details` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `item_id` int(10) unsigned NOT NULL,
  `data` text COLLATE utf8_unicode_ci NOT NULL,
  `datatype` varchar(2) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=31 ;

--
-- Dumping data for table `site_item_details`
--

INSERT INTO `site_item_details` (`id`, `created_at`, `updated_at`, `item_id`, `data`, `datatype`) VALUES
(1, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 1, 'Make', '1'),
(2, '2015-05-20 06:18:36', '2015-05-20 06:18:36', 1, 'Capacity', '1'),
(3, '2015-05-20 06:18:36', '2015-05-20 06:18:36', 1, 'AB Switch', '2'),
(4, '2015-05-20 06:18:36', '2015-05-20 06:18:36', 1, 'Mount', '2'),
(5, '2015-05-20 06:18:36', '2015-05-20 06:18:36', 1, 'Cross Arm', '2'),
(6, '2015-05-20 06:18:37', '2015-05-20 06:18:37', 1, 'Shakles', '2'),
(7, '2015-05-20 06:18:37', '2015-05-20 06:18:37', 1, 'Pin Insulators', '2'),
(8, '2015-05-20 06:18:37', '2015-05-20 06:18:37', 1, 'HG Fuse Set', '2'),
(9, '2015-05-20 06:18:37', '2015-05-20 06:18:37', 1, 'LT Fuse Set', '2'),
(10, '2015-05-20 06:18:37', '2015-05-20 06:18:37', 1, 'Other', '1'),
(11, '2015-05-20 06:18:38', '2015-05-20 06:18:38', 2, 'Pole Type', '2'),
(12, '2015-05-20 06:18:38', '2015-05-20 06:18:38', 2, 'LT Cross Arm', '2'),
(13, '2015-05-20 06:18:38', '2015-05-20 06:18:38', 2, 'Top Cleat', '2'),
(14, '2015-05-20 06:18:39', '2015-05-20 06:18:39', 2, 'LT Pin Insulators', '2'),
(15, '2015-05-20 06:18:39', '2015-05-20 06:18:39', 2, 'LT Shakles', '2'),
(16, '2015-05-20 06:18:39', '2015-05-20 06:18:39', 2, 'LT Staysets', '2'),
(17, '2015-05-20 06:18:39', '2015-05-20 06:18:39', 2, 'No of Wires', '2'),
(18, '2015-05-20 06:18:40', '2015-05-20 06:18:40', 2, 'Pole Height', '2'),
(19, '2015-05-20 06:18:40', '2015-05-20 06:18:40', 2, 'Pole Condition', '2'),
(20, '2015-05-20 06:18:40', '2015-05-20 06:18:40', 2, 'Guy Insulators', '2'),
(21, '2015-05-20 06:18:40', '2015-05-20 06:18:40', 2, 'LT/HT', '2'),
(22, '2015-05-20 06:18:41', '2015-05-20 06:18:41', 2, 'Conductor Type', '2'),
(23, '2015-05-20 06:18:41', '2015-05-20 06:18:41', 2, 'Conductor Condition', '2'),
(24, '2015-05-20 06:18:41', '2015-05-20 06:18:41', 2, 'HT Crossing', '2'),
(25, '2015-05-20 06:18:42', '2015-05-20 06:18:42', 2, 'Other', '1'),
(26, '2015-05-20 06:18:42', '2015-05-20 06:18:42', 3, 'Service No', '1'),
(27, '2015-05-20 06:18:42', '2015-05-20 06:18:42', 3, 'Load', '1'),
(28, '2015-05-20 06:18:43', '2015-05-20 06:18:43', 3, 'Authorisation', '2'),
(29, '2015-05-20 06:18:43', '2015-05-20 06:18:43', 3, 'Service Holder', '1'),
(30, '2015-05-20 06:18:43', '2015-05-20 06:18:43', 3, 'Other', '1');

-- --------------------------------------------------------

--
-- Table structure for table `site_materials`
--

CREATE TABLE IF NOT EXISTS `site_materials` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `site_id` int(10) unsigned NOT NULL,
  `material_id` int(10) unsigned NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '0',
  `opening` int(11) NOT NULL DEFAULT '0',
  `created_by` int(10) unsigned NOT NULL,
  `activation` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `site_transactions`
--

CREATE TABLE IF NOT EXISTS `site_transactions` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` int(10) unsigned NOT NULL,
  `site_id` int(10) unsigned NOT NULL,
  `type` int(11) NOT NULL DEFAULT '1',
  `status` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `site_transaction_datas`
--

CREATE TABLE IF NOT EXISTS `site_transaction_datas` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `trans_id` int(10) unsigned NOT NULL,
  `material_id` int(10) unsigned NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '0',
  `type` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE IF NOT EXISTS `stores` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `location` varchar(1000) COLLATE utf8_unicode_ci NOT NULL,
  `company_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `created_by` int(10) unsigned NOT NULL,
  `activation` int(10) unsigned NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `created_at`, `updated_at`, `name`, `location`, `company_id`, `user_id`, `created_by`, `activation`) VALUES
(1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Some Store name', 'Kadapa', 2, 4, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `store_addons`
--

CREATE TABLE IF NOT EXISTS `store_addons` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` int(10) unsigned NOT NULL,
  `material_id` int(10) unsigned NOT NULL,
  `made_from` int(10) unsigned NOT NULL,
  `ratio` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `store_datas`
--

CREATE TABLE IF NOT EXISTS `store_datas` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `trans_id` int(10) unsigned NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `phoneno` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(10) unsigned NOT NULL DEFAULT '0',
  `sendtostore` int(11) NOT NULL DEFAULT '0',
  `sendtosite` int(11) NOT NULL DEFAULT '0',
  `receivefromstore` int(11) NOT NULL DEFAULT '0',
  `receivefromsite` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `store_documents`
--

CREATE TABLE IF NOT EXISTS `store_documents` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `doctype` int(11) NOT NULL,
  `docpath` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `data_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `store_materials`
--

CREATE TABLE IF NOT EXISTS `store_materials` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `units` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `category_id` int(11) NOT NULL,
  `created_by` int(10) unsigned NOT NULL,
  `type` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Dumping data for table `store_materials`
--

INSERT INTO `store_materials` (`id`, `created_at`, `updated_at`, `name`, `units`, `category_id`, `created_by`, `type`) VALUES
(1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '16 Kva 3 Phase Transformer', 'NOS', 1, 4, 1),
(2, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '25 Kva 3 Phase Transformer', 'NOS', 1, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `store_stocks`
--

CREATE TABLE IF NOT EXISTS `store_stocks` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `store_id` int(10) unsigned NOT NULL,
  `material_id` int(10) unsigned NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '0',
  `opening` int(11) NOT NULL DEFAULT '0',
  `created_by` int(10) unsigned NOT NULL,
  `activation` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Dumping data for table `store_stocks`
--

INSERT INTO `store_stocks` (`id`, `created_at`, `updated_at`, `store_id`, `material_id`, `quantity`, `opening`, `created_by`, `activation`) VALUES
(1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 1, 150, 0, 4, 1),
(2, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 2, 250, 0, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `store_transactions`
--

CREATE TABLE IF NOT EXISTS `store_transactions` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` int(10) unsigned NOT NULL,
  `store_id` int(10) unsigned NOT NULL,
  `type` int(11) NOT NULL DEFAULT '1',
  `status` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `store_transaction_datas`
--

CREATE TABLE IF NOT EXISTS `store_transaction_datas` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `trans_id` int(10) unsigned NOT NULL,
  `stock_id` int(10) unsigned NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '0',
  `type` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE IF NOT EXISTS `subscriptions` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `company_id` int(10) unsigned NOT NULL,
  `wms` int(11) NOT NULL DEFAULT '1',
  `survey` int(11) NOT NULL DEFAULT '1',
  `accounting` int(11) NOT NULL DEFAULT '1',
  `purchases` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `created_at`, `updated_at`, `company_id`, `wms`, `survey`, `accounting`, `purchases`) VALUES
(1, '2015-05-20 06:18:45', '2015-05-20 06:18:45', 2, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `surveys`
--

CREATE TABLE IF NOT EXISTS `surveys` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `site_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `type` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `survey_datas`
--

CREATE TABLE IF NOT EXISTS `survey_datas` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `survey_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `item_id` int(10) unsigned NOT NULL,
  `backlink` int(10) unsigned NOT NULL DEFAULT '0',
  `photopath` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `descr` text COLLATE utf8_unicode_ci NOT NULL,
  `latitude` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `longitude` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `survey_item_details`
--

CREATE TABLE IF NOT EXISTS `survey_item_details` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `data_id` int(10) unsigned NOT NULL,
  `detail_id` int(10) unsigned NOT NULL,
  `response` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `username` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `designation` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `phoneno` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `address` text COLLATE utf8_unicode_ci NOT NULL,
  `role` int(11) NOT NULL DEFAULT '0',
  `company_id` int(10) unsigned NOT NULL,
  `activation` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=8 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `created_at`, `updated_at`, `username`, `email`, `password`, `designation`, `name`, `phoneno`, `address`, `role`, `company_id`, `activation`) VALUES
(1, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 'mainadmin', 'pradyumna@pixelvide.com', '6b1bebf39a6c17d8f2423f478ff40cd096fbcc38949152d893a2057955594570', 'Main Admin', 'Pradyumna', '9705856878', 'Pixelvide, Hyderabad', 0, 1, 1),
(2, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 'admin', 'admin@ssel.in', 'f902f060476029043a6ae6cddf12bbbabb4bfc29531c018dde4439729541d165', 'Admin', 'Admin', '9705856878', 'SSE, Kadapa', 1, 2, 1),
(3, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 'ph', 'ph@ssel.in', '55d57ee5fa03a83339680b87f2468e0de492d68577b5880c05dc25fbe898fe4b', 'Projects Head', 'PH', '9705856878', 'SSE, Kadapa', 2, 2, 1),
(4, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 'manager', 'store@ssel.in', '075cfdc5bee29b943a4f2d00bb3520d03615279115c03f26f9481becd3d9eafe', 'Store Manager', 'Admin', '9705856879', 'SSE, Kadapa', 5, 2, 1),
(5, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 'purchases', 'store@ssel.in', '46a71d3305a5f9d04cf8771fdac0cdd6fb04988500a68d9d00110f89db0ede5c', 'Purchases', 'Purchases', '9705856879', 'SSE, Kadapa', 6, 2, 1),
(7, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 'billing', 'store@ssel.in', '11ed593a9eb24c2719ca0294d2865f73419fbd748a51f4100da1f5278345f11b', 'Billing', 'Billing', '9705856879', 'SSE, Kadapa', 7, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE IF NOT EXISTS `user_roles` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `role` int(11) NOT NULL DEFAULT '0',
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=9 ;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `created_at`, `updated_at`, `role`, `name`) VALUES
(1, '2015-05-20 06:18:34', '2015-05-20 06:18:34', 1, 'Admin'),
(2, '2015-05-20 06:18:34', '2015-05-20 06:18:34', 2, 'Projects Head'),
(3, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 3, 'Project Manager'),
(4, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 4, 'Supervisor'),
(5, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 5, 'Store Manager'),
(6, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 0, 'Main Admin'),
(7, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 6, 'Purchases'),
(8, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 7, 'Billing');

-- --------------------------------------------------------

--
-- Table structure for table `works`
--

CREATE TABLE IF NOT EXISTS `works` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `project_id` int(10) unsigned NOT NULL,
  `tires` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` int(10) unsigned NOT NULL,
  `created_by` int(10) unsigned NOT NULL,
  `assigned_to` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `work_divisions`
--

CREATE TABLE IF NOT EXISTS `work_divisions` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `work_id` int(10) unsigned NOT NULL,
  `assigned_to` int(10) unsigned NOT NULL,
  `assigned_by` int(10) unsigned NOT NULL,
  `tire` int(11) NOT NULL DEFAULT '0',
  `activation` int(11) NOT NULL DEFAULT '1',
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `backlink` int(10) unsigned NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `work_ids`
--

CREATE TABLE IF NOT EXISTS `work_ids` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `work_id` int(10) unsigned NOT NULL,
  `code` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `work_progresses`
--

CREATE TABLE IF NOT EXISTS `work_progresses` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `site_id` int(10) unsigned NOT NULL,
  `photopath` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `latitude` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `longitude` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `work_types`
--

CREATE TABLE IF NOT EXISTS `work_types` (
`id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `type` text COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(10) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Dumping data for table `work_types`
--

INSERT INTO `work_types` (`id`, `created_at`, `updated_at`, `type`, `code`) VALUES
(1, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 'HVDS', 'HVDS'),
(2, '2015-05-20 06:18:35', '2015-05-20 06:18:35', 'Sub Station Construction', 'SSC');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `companies_name_unique` (`name`);

--
-- Indexes for table `company_transactions`
--
ALTER TABLE `company_transactions`
 ADD PRIMARY KEY (`id`), ADD KEY `company_transactions_company_id_index` (`company_id`);

--
-- Indexes for table `data_refreshes`
--
ALTER TABLE `data_refreshes`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `document_types`
--
ALTER TABLE `document_types`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `material_category`
--
ALTER TABLE `material_category`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
 ADD PRIMARY KEY (`id`), ADD KEY `menus_module_id_foreign` (`module_id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
 ADD PRIMARY KEY (`id`), ADD KEY `news_user_id_foreign` (`user_id`);

--
-- Indexes for table `passwords`
--
ALTER TABLE `passwords`
 ADD PRIMARY KEY (`id`), ADD KEY `passwords_user_id_index` (`user_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
 ADD PRIMARY KEY (`id`), ADD KEY `projects_created_by_index` (`created_by`), ADD KEY `projects_company_id_index` (`company_id`), ADD KEY `projects_user_id_index` (`user_id`);

--
-- Indexes for table `project_documents`
--
ALTER TABLE `project_documents`
 ADD PRIMARY KEY (`id`), ADD KEY `project_documents_project_id_index` (`project_id`);

--
-- Indexes for table `queries`
--
ALTER TABLE `queries`
 ADD PRIMARY KEY (`id`), ADD KEY `queries_resolved_by_foreign` (`resolved_by`), ADD KEY `queries_user_id_index` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `sessions_refreshtoken_unique` (`refreshtoken`), ADD KEY `sessions_user_id_index` (`user_id`), ADD KEY `sessions_expiry_time_index` (`expiry_time`);

--
-- Indexes for table `sites`
--
ALTER TABLE `sites`
 ADD PRIMARY KEY (`id`), ADD KEY `sites_survey_user_foreign` (`survey_user`), ADD KEY `sites_work_id_index` (`work_id`), ADD KEY `sites_user_id_index` (`user_id`);

--
-- Indexes for table `site_attendances`
--
ALTER TABLE `site_attendances`
 ADD PRIMARY KEY (`id`), ADD KEY `site_attendances_site_id_index` (`site_id`);

--
-- Indexes for table `site_items`
--
ALTER TABLE `site_items`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `site_items_name_unique` (`name`);

--
-- Indexes for table `site_item_descrs`
--
ALTER TABLE `site_item_descrs`
 ADD PRIMARY KEY (`id`), ADD KEY `site_item_descrs_itemdata_id_index` (`itemdata_id`);

--
-- Indexes for table `site_item_details`
--
ALTER TABLE `site_item_details`
 ADD PRIMARY KEY (`id`), ADD KEY `site_item_details_item_id_index` (`item_id`);

--
-- Indexes for table `site_materials`
--
ALTER TABLE `site_materials`
 ADD PRIMARY KEY (`id`), ADD KEY `site_materials_site_id_index` (`site_id`), ADD KEY `site_materials_material_id_index` (`material_id`), ADD KEY `site_materials_created_by_index` (`created_by`);

--
-- Indexes for table `site_transactions`
--
ALTER TABLE `site_transactions`
 ADD PRIMARY KEY (`id`), ADD KEY `site_transactions_created_by_index` (`created_by`), ADD KEY `site_transactions_site_id_index` (`site_id`);

--
-- Indexes for table `site_transaction_datas`
--
ALTER TABLE `site_transaction_datas`
 ADD PRIMARY KEY (`id`), ADD KEY `site_transaction_datas_trans_id_index` (`trans_id`), ADD KEY `site_transaction_datas_material_id_index` (`material_id`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `stores_user_id_unique` (`user_id`), ADD KEY `stores_company_id_index` (`company_id`), ADD KEY `stores_created_by_foreign` (`created_by`);

--
-- Indexes for table `store_addons`
--
ALTER TABLE `store_addons`
 ADD PRIMARY KEY (`id`), ADD KEY `store_addons_material_id_index` (`material_id`), ADD KEY `store_addons_made_from_index` (`made_from`), ADD KEY `store_addons_created_by_index` (`created_by`);

--
-- Indexes for table `store_datas`
--
ALTER TABLE `store_datas`
 ADD PRIMARY KEY (`id`), ADD KEY `store_datas_trans_id_index` (`trans_id`), ADD KEY `store_datas_user_id_index` (`user_id`);

--
-- Indexes for table `store_documents`
--
ALTER TABLE `store_documents`
 ADD PRIMARY KEY (`id`), ADD KEY `store_documents_data_id_index` (`data_id`);

--
-- Indexes for table `store_materials`
--
ALTER TABLE `store_materials`
 ADD PRIMARY KEY (`id`), ADD KEY `store_materials_created_by_foreign` (`created_by`);

--
-- Indexes for table `store_stocks`
--
ALTER TABLE `store_stocks`
 ADD PRIMARY KEY (`id`), ADD KEY `store_stocks_store_id_index` (`store_id`), ADD KEY `store_stocks_material_id_index` (`material_id`), ADD KEY `store_stocks_created_by_index` (`created_by`);

--
-- Indexes for table `store_transactions`
--
ALTER TABLE `store_transactions`
 ADD PRIMARY KEY (`id`), ADD KEY `store_transactions_created_by_index` (`created_by`), ADD KEY `store_transactions_store_id_index` (`store_id`);

--
-- Indexes for table `store_transaction_datas`
--
ALTER TABLE `store_transaction_datas`
 ADD PRIMARY KEY (`id`), ADD KEY `store_transaction_datas_trans_id_index` (`trans_id`), ADD KEY `store_transaction_datas_stock_id_index` (`stock_id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
 ADD PRIMARY KEY (`id`), ADD KEY `subscriptions_company_id_index` (`company_id`);

--
-- Indexes for table `surveys`
--
ALTER TABLE `surveys`
 ADD PRIMARY KEY (`id`), ADD KEY `surveys_user_id_index` (`user_id`), ADD KEY `surveys_site_id_index` (`site_id`);

--
-- Indexes for table `survey_datas`
--
ALTER TABLE `survey_datas`
 ADD PRIMARY KEY (`id`), ADD KEY `survey_datas_survey_id_index` (`survey_id`), ADD KEY `survey_datas_user_id_index` (`user_id`), ADD KEY `survey_datas_item_id_index` (`item_id`), ADD KEY `survey_datas_backlink_index` (`backlink`);

--
-- Indexes for table `survey_item_details`
--
ALTER TABLE `survey_item_details`
 ADD PRIMARY KEY (`id`), ADD KEY `survey_item_details_data_id_index` (`data_id`), ADD KEY `survey_item_details_detail_id_index` (`detail_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `users_username_unique` (`username`), ADD KEY `users_company_id_index` (`company_id`), ADD KEY `users_email_index` (`email`), ADD KEY `users_password_index` (`password`), ADD KEY `users_phoneno_index` (`phoneno`), ADD KEY `users_role_index` (`role`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `works`
--
ALTER TABLE `works`
 ADD PRIMARY KEY (`id`), ADD KEY `works_project_id_foreign` (`project_id`), ADD KEY `works_created_by_foreign` (`created_by`), ADD KEY `works_assigned_to_foreign` (`assigned_to`);

--
-- Indexes for table `work_divisions`
--
ALTER TABLE `work_divisions`
 ADD PRIMARY KEY (`id`), ADD KEY `work_divisions_assigned_by_foreign` (`assigned_by`), ADD KEY `work_divisions_work_id_index` (`work_id`), ADD KEY `work_divisions_assigned_to_index` (`assigned_to`), ADD KEY `work_divisions_tire_index` (`tire`);

--
-- Indexes for table `work_ids`
--
ALTER TABLE `work_ids`
 ADD PRIMARY KEY (`id`), ADD KEY `work_ids_work_id_foreign` (`work_id`);

--
-- Indexes for table `work_progresses`
--
ALTER TABLE `work_progresses`
 ADD PRIMARY KEY (`id`), ADD KEY `work_progresses_site_id_index` (`site_id`), ADD KEY `work_progresses_user_id_index` (`user_id`);

--
-- Indexes for table `work_types`
--
ALTER TABLE `work_types`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `work_types_code_unique` (`code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `company_transactions`
--
ALTER TABLE `company_transactions`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `data_refreshes`
--
ALTER TABLE `data_refreshes`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `document_types`
--
ALTER TABLE `document_types`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `material_category`
--
ALTER TABLE `material_category`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `passwords`
--
ALTER TABLE `passwords`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `project_documents`
--
ALTER TABLE `project_documents`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `queries`
--
ALTER TABLE `queries`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=50;
--
-- AUTO_INCREMENT for table `sites`
--
ALTER TABLE `sites`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `site_attendances`
--
ALTER TABLE `site_attendances`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `site_items`
--
ALTER TABLE `site_items`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `site_item_descrs`
--
ALTER TABLE `site_item_descrs`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=135;
--
-- AUTO_INCREMENT for table `site_item_details`
--
ALTER TABLE `site_item_details`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `site_materials`
--
ALTER TABLE `site_materials`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `site_transactions`
--
ALTER TABLE `site_transactions`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `site_transaction_datas`
--
ALTER TABLE `site_transaction_datas`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `store_addons`
--
ALTER TABLE `store_addons`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `store_datas`
--
ALTER TABLE `store_datas`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `store_documents`
--
ALTER TABLE `store_documents`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `store_materials`
--
ALTER TABLE `store_materials`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `store_stocks`
--
ALTER TABLE `store_stocks`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `store_transactions`
--
ALTER TABLE `store_transactions`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `store_transaction_datas`
--
ALTER TABLE `store_transaction_datas`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `surveys`
--
ALTER TABLE `surveys`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `survey_datas`
--
ALTER TABLE `survey_datas`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `survey_item_details`
--
ALTER TABLE `survey_item_details`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `works`
--
ALTER TABLE `works`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `work_divisions`
--
ALTER TABLE `work_divisions`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `work_ids`
--
ALTER TABLE `work_ids`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `work_progresses`
--
ALTER TABLE `work_progresses`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `work_types`
--
ALTER TABLE `work_types`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `company_transactions`
--
ALTER TABLE `company_transactions`
ADD CONSTRAINT `company_transactions_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

--
-- Constraints for table `menus`
--
ALTER TABLE `menus`
ADD CONSTRAINT `menus_module_id_foreign` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`);

--
-- Constraints for table `news`
--
ALTER TABLE `news`
ADD CONSTRAINT `news_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `passwords`
--
ALTER TABLE `passwords`
ADD CONSTRAINT `passwords_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
ADD CONSTRAINT `projects_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
ADD CONSTRAINT `projects_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
ADD CONSTRAINT `projects_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `project_documents`
--
ALTER TABLE `project_documents`
ADD CONSTRAINT `project_documents_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

--
-- Constraints for table `queries`
--
ALTER TABLE `queries`
ADD CONSTRAINT `queries_resolved_by_foreign` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`),
ADD CONSTRAINT `queries_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
ADD CONSTRAINT `sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `sites`
--
ALTER TABLE `sites`
ADD CONSTRAINT `sites_survey_user_foreign` FOREIGN KEY (`survey_user`) REFERENCES `users` (`id`),
ADD CONSTRAINT `sites_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
ADD CONSTRAINT `sites_work_id_foreign` FOREIGN KEY (`work_id`) REFERENCES `work_ids` (`id`);

--
-- Constraints for table `site_attendances`
--
ALTER TABLE `site_attendances`
ADD CONSTRAINT `site_attendances_site_id_foreign` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`);

--
-- Constraints for table `site_item_descrs`
--
ALTER TABLE `site_item_descrs`
ADD CONSTRAINT `site_item_descrs_itemdata_id_foreign` FOREIGN KEY (`itemdata_id`) REFERENCES `site_item_details` (`id`);

--
-- Constraints for table `site_item_details`
--
ALTER TABLE `site_item_details`
ADD CONSTRAINT `site_item_details_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `site_items` (`id`);

--
-- Constraints for table `site_materials`
--
ALTER TABLE `site_materials`
ADD CONSTRAINT `site_materials_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
ADD CONSTRAINT `site_materials_material_id_foreign` FOREIGN KEY (`material_id`) REFERENCES `store_materials` (`id`),
ADD CONSTRAINT `site_materials_site_id_foreign` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`);

--
-- Constraints for table `site_transactions`
--
ALTER TABLE `site_transactions`
ADD CONSTRAINT `site_transactions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
ADD CONSTRAINT `site_transactions_site_id_foreign` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`);

--
-- Constraints for table `site_transaction_datas`
--
ALTER TABLE `site_transaction_datas`
ADD CONSTRAINT `site_transaction_datas_material_id_foreign` FOREIGN KEY (`material_id`) REFERENCES `site_materials` (`id`),
ADD CONSTRAINT `site_transaction_datas_trans_id_foreign` FOREIGN KEY (`trans_id`) REFERENCES `site_transactions` (`id`);

--
-- Constraints for table `stores`
--
ALTER TABLE `stores`
ADD CONSTRAINT `stores_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
ADD CONSTRAINT `stores_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
ADD CONSTRAINT `stores_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `store_addons`
--
ALTER TABLE `store_addons`
ADD CONSTRAINT `store_addons_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
ADD CONSTRAINT `store_addons_made_from_foreign` FOREIGN KEY (`made_from`) REFERENCES `store_materials` (`id`),
ADD CONSTRAINT `store_addons_material_id_foreign` FOREIGN KEY (`material_id`) REFERENCES `store_materials` (`id`);

--
-- Constraints for table `store_datas`
--
ALTER TABLE `store_datas`
ADD CONSTRAINT `store_datas_trans_id_foreign` FOREIGN KEY (`trans_id`) REFERENCES `store_transactions` (`id`);

--
-- Constraints for table `store_documents`
--
ALTER TABLE `store_documents`
ADD CONSTRAINT `store_documents_data_id_foreign` FOREIGN KEY (`data_id`) REFERENCES `store_datas` (`id`);

--
-- Constraints for table `store_materials`
--
ALTER TABLE `store_materials`
ADD CONSTRAINT `store_materials_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `store_stocks`
--
ALTER TABLE `store_stocks`
ADD CONSTRAINT `store_stocks_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
ADD CONSTRAINT `store_stocks_material_id_foreign` FOREIGN KEY (`material_id`) REFERENCES `store_materials` (`id`),
ADD CONSTRAINT `store_stocks_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);

--
-- Constraints for table `store_transactions`
--
ALTER TABLE `store_transactions`
ADD CONSTRAINT `store_transactions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
ADD CONSTRAINT `store_transactions_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);

--
-- Constraints for table `store_transaction_datas`
--
ALTER TABLE `store_transaction_datas`
ADD CONSTRAINT `store_transaction_datas_stock_id_foreign` FOREIGN KEY (`stock_id`) REFERENCES `store_stocks` (`id`),
ADD CONSTRAINT `store_transaction_datas_trans_id_foreign` FOREIGN KEY (`trans_id`) REFERENCES `store_transactions` (`id`);

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
ADD CONSTRAINT `subscriptions_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

--
-- Constraints for table `surveys`
--
ALTER TABLE `surveys`
ADD CONSTRAINT `surveys_site_id_foreign` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`),
ADD CONSTRAINT `surveys_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `survey_datas`
--
ALTER TABLE `survey_datas`
ADD CONSTRAINT `survey_datas_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `site_items` (`id`),
ADD CONSTRAINT `survey_datas_survey_id_foreign` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`),
ADD CONSTRAINT `survey_datas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `survey_item_details`
--
ALTER TABLE `survey_item_details`
ADD CONSTRAINT `survey_item_details_data_id_foreign` FOREIGN KEY (`data_id`) REFERENCES `survey_datas` (`id`),
ADD CONSTRAINT `survey_item_details_detail_id_foreign` FOREIGN KEY (`detail_id`) REFERENCES `site_item_details` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
ADD CONSTRAINT `users_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

--
-- Constraints for table `works`
--
ALTER TABLE `works`
ADD CONSTRAINT `works_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`),
ADD CONSTRAINT `works_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
ADD CONSTRAINT `works_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

--
-- Constraints for table `work_divisions`
--
ALTER TABLE `work_divisions`
ADD CONSTRAINT `work_divisions_assigned_by_foreign` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`),
ADD CONSTRAINT `work_divisions_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`),
ADD CONSTRAINT `work_divisions_work_id_foreign` FOREIGN KEY (`work_id`) REFERENCES `works` (`id`);

--
-- Constraints for table `work_ids`
--
ALTER TABLE `work_ids`
ADD CONSTRAINT `work_ids_work_id_foreign` FOREIGN KEY (`work_id`) REFERENCES `work_divisions` (`id`);

--
-- Constraints for table `work_progresses`
--
ALTER TABLE `work_progresses`
ADD CONSTRAINT `work_progresses_site_id_foreign` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`),
ADD CONSTRAINT `work_progresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
