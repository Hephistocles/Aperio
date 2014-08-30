CREATE DATABASE  IF NOT EXISTS `aperio` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `aperio`;
-- MySQL dump 10.13  Distrib 5.6.17, for Win32 (x86)
--
-- Host: localhost    Database: aperio
-- ------------------------------------------------------
-- Server version	5.6.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary table structure for view `avg_user_ratings`
--

DROP TABLE IF EXISTS `avg_user_ratings`;
/*!50001 DROP VIEW IF EXISTS `avg_user_ratings`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `avg_user_ratings` (
  `user_id` tinyint NOT NULL,
  `personal_avg` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `comment_text` text NOT NULL,
  `response_id` int(11) unsigned NOT NULL,
  `author_id` int(11) unsigned NOT NULL,
  `is_anonymous` tinyint(4) unsigned zerofill DEFAULT NULL,
  `time_stamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `comment_id_UNIQUE` (`id`),
  KEY `author_link_idx` (`author_id`),
  KEY `response_link_idx` (`response_id`),
  CONSTRAINT `author_link` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `response_link` FOREIGN KEY (`response_id`) REFERENCES `responses` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'This is a load of <strong>rubbish</strong>!',1,2,NULL,'2014-08-28 21:54:00'),(2,'Dude, thanks for your comment. But what on earth does \"quantum\" mean? Do you think I should I try sitting under a cherry tree instead of an Apple one?',7,2,NULL,'2014-08-28 21:54:00'),(3,'No, I am talking about something much much smaller than either a cherry or an apple!',7,15,NULL,'2014-08-28 21:54:00'),(4,'What? Like a sultana?',7,2,NULL,'2014-08-28 21:54:00'),(5,'Newts, I can\'t belive you don\'t know this! Lol, jks. Quantum means minimum amount of any physical entity involved in an interaction. So if you cut your apple in half, and then cut that half in half, and then keep going and going...and going. Eventually you\'ll have a tiny tiny bit of apple\' that physically can\'t be halved anymore - that would be a sort of \"quantum of apple\"',7,16,NULL,'2014-08-28 21:54:00'),(6,'Wooooah! That\'s rad Steve. I wish I was born in the 21st century! The science you guyz hav sound wicked! Things are pretty dull back here in the 1700\'s :( sucks!',7,2,NULL,'2014-08-28 21:54:00'),(7,'I don\'t know. Why?',13,15,NULL,'2014-08-28 21:54:00'),(8,'Because they make up everything!',13,16,NULL,'2014-08-28 21:54:00'),(9,'About time!',11,15,NULL,'2014-08-28 21:54:00'),(10,'Yeah! How did you know?',11,16,NULL,'2014-08-28 21:54:00'),(11,'comment',1,9,NULL,'2014-08-29 13:37:40'),(12,'You can\'t science',9,9,NULL,'2014-08-29 13:38:08'),(13,'You are both idiots',11,9,NULL,'2014-08-29 13:48:35'),(14,'\\[x\\]',15,9,NULL,'2014-08-29 13:52:33'),(15,'I\'m so good',5,9,NULL,'2014-08-29 14:10:54');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `documents` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `location` text NOT NULL,
  `title` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `time_stamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `abstract` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,'http://arxiv.org/ftp/arxiv/papers/1408/1408.6186.pdf','A stolen document',9,'2014-08-29 11:07:33',NULL),(2,'http://rsta.royalsocietypublishing.org/content/366/1882/3883.full.pdf','A geophysiologist\'s thoughts on geoengineering\rA geophysiologist\'s thoughts on geoengineering\r',14,'2014-08-29 11:07:33',NULL),(3,'http://www.science.uwaterloo.ca/~lkong/paper/generalized%20relativity.pdf','A Generalized Theory of Gravitation',15,'2014-08-29 11:07:33',NULL),(4,'http://www.jstor.org/discover/10.2307/1968714?uid=3738032&uid=2&uid=4&sid=21104100255091','The Gravitational Equations and the Problems of Motion',15,'2014-08-29 11:07:33',NULL),(5,'http://cdn.preterhuman.net/texts/science_and_technology/Ebook%20-%20Physics%20-%20Albert%20Einstein%20-%20Relativity.pdf','The Special Theory of Relativity',15,'2014-08-29 11:07:33',NULL),(6,'http://www.science.uwaterloo.ca/~lkong/paper/generalized%20relativity.pdf','A Generalized Theory of Gravitation',15,'2014-08-29 11:07:33',NULL),(7,'ftp://isito.kg/book/%D4%E8%E7%E8%EA%E0/%D5%EE%EA%E8%ED%E3%20%D1/Bonus/Publications/The%20four%20laws%20of%20black%20hole%20mechanics.pdf','The Four Laws of Black Hole Mechanics\r',16,'2014-08-29 11:07:33',NULL),(8,'http://rspa.royalsocietypublishing.org/content/314/1519/529.full.pdf','The Singularities of Gravitational Collapse and Cosmology',16,'2014-08-29 11:07:33',NULL),(9,'http://arxiv.org/pdf/1001.0785.pdf','On the Origin of Gravity\r',2,'2014-08-29 11:11:20','Starting from first principles and general ssumptions Newton\'s law of gravityation is shown to arise naturally and unavoidably in a theory in which space is emergent through a holographic scenario. Gravity is explained as an entropic force caused by changes in the information associated with the positions of material bodies. A relativistic generalization of the presented arguments directly leads to the Einstein equations. When space is emergent even Newton\'s law of inertia needs to be explained. The equivalence principle leads us to conclude that it is actually this law of inertia whose origin is entropic.');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `max_avg_rating`
--

DROP TABLE IF EXISTS `max_avg_rating`;
/*!50001 DROP VIEW IF EXISTS `max_avg_rating`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `max_avg_rating` (
  `max` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `response_types`
--

DROP TABLE IF EXISTS `response_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `response_types` (
  `id` int(11) unsigned NOT NULL,
  `name` tinytext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `response_types`
--

LOCK TABLES `response_types` WRITE;
/*!40000 ALTER TABLE `response_types` DISABLE KEYS */;
INSERT INTO `response_types` VALUES (1,'Implication'),(2,'Review'),(3,'Summary'),(4,'Related Content'),(5,'Refinement'),(6,'Further Discussion'),(7,'Correction');
/*!40000 ALTER TABLE `response_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responses`
--

DROP TABLE IF EXISTS `responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `responses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `document_id` int(10) unsigned DEFAULT NULL,
  `content` longtext,
  `user_id` int(10) unsigned DEFAULT NULL,
  `rating` float DEFAULT '0',
  `response_type` int(10) unsigned DEFAULT NULL,
  `time_stamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `response_type_link_idx` (`response_type`),
  CONSTRAINT `response_type_link` FOREIGN KEY (`response_type`) REFERENCES `response_types` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responses`
--

LOCK TABLES `responses` WRITE;
/*!40000 ALTER TABLE `responses` DISABLE KEYS */;
INSERT INTO `responses` VALUES (1,1,'This is basically saying that we should be more environmentally friendly',13,49.245,3,'2014-08-29 05:15:05'),(2,9,'This is a well written paper. It is interesting to note this alternate definition for the set \\(H_f\\), due to Turing: <br /><p>Let \\(H_f\\) be a set defined as follows:<br/>\\[H_f = \\left\\{ { \\left({ \\left[{M}\\right], x}\\right) : \\text{$M$ accepts $x$ in $f \\left({\\left\\vert{x}\\right\\vert}\\right)$ steps} }\\right\\}\\] <br/> where: <ul><li> \\(M\\) is a <a href=\"/wiki/Definition:Turing_Machine\" title=\"Definition:Turing Machine\">deterministic Turing machine</a></li><li> \\(x\\) is its input (the initial contents of its tape)</li><li> \\(\\left[{M}\\right]\\) denotes an input that encodes the Turing machine \\(M\\)</li></ul>',13,88.5,5,'2014-08-29 05:15:05'),(3,9,'There is a correction to be made in line 56. It should clearly be as follows<br />\\(\\int_0^\\infty x^2\\mathrm{d}x=-1\\)',9,8.7,7,'2014-08-29 05:15:05'),(5,1,'Hi here is the schrodinger equation<br>\\[i\\hbar\\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r},t) = \\left [ \\frac{-\\hbar^2}{2\\mu}\\nabla^2 + V(\\mathbf{r},t)\\right ] \\Psi(\\mathbf{r},t)\\]<br>Thanks for reading<br><br>',9,0,3,'2014-08-29 10:11:51'),(6,9,'This is <b><i>great content.<br><ol><li>I love numbers!</li></ol><br><br></i></b>',13,0,3,'2014-08-29 11:09:40'),(7,9,'Hey, Newto, this is cool. But have you thought about what would happen to the laws of gravity when they are applied on a much smaller scale to quantum particles?',15,29.98,6,'2014-08-29 11:09:40'),(8,1,'This is a real stpid demo...',13,-0.775,2,'2014-08-29 11:25:08'),(9,1,'asf;kjaflakwhf;je',13,0,2,'2014-08-29 11:26:40'),(10,1,'kbdsddlhlhajflknjafew',13,0,2,'2014-08-29 11:30:24'),(11,9,'I\'d deveoped a theory about space that you might find interseting? You can check it out <a href=\"http://rspa.royalsocietypublishing.org/content/314/1519/529.full.pdf\">here</a>',16,90.3,4,'2014-08-29 11:30:24'),(12,5,'Special relativity relativity describes the relationship between space and time',14,75,3,'2014-08-29 11:30:24'),(13,9,'Why can\'t you trust an atom?',16,55,6,'2014-08-29 11:30:24'),(14,9,'Guys, I don\'t get it. What have apples got to do with physics? :S',14,17.4,2,'2014-08-29 12:29:00'),(15,9,'Hi, $\\cint$',9,0,2,'2014-08-29 13:52:16');
/*!40000 ALTER TABLE `responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `user_ratings`
--

DROP TABLE IF EXISTS `user_ratings`;
/*!50001 DROP VIEW IF EXISTS `user_ratings`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `user_ratings` (
  `user_id` tinyint NOT NULL,
  `rating` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(45) NOT NULL,
  `real_name` varchar(45) DEFAULT NULL,
  `picture_url` text,
  `rank` int(10) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'hephistocles','Christopher Little',NULL,1),(2,'newton','Isaac Newton','http://img2.timeinc.net/health/images/slides/isaac-newton-gout-400x400.jpg',1),(9,'tjlefeuvre@gmail.com','Thomas Le Feuvre','https://lh5.googleusercontent.com/-lSWdjjb5J1w/AAAAAAAAAAI/AAAAAAAABuc/CiUD9C0jQt8/photo.jpg',1),(13,'hephst@gmail.com','Christopher Little','https://lh3.googleusercontent.com/-xPsB3CVwDmI/AAAAAAAAAAI/AAAAAAAAAEg/7nB1bu1wDjU/photo.jpg',1),(14,'caroline.sarah.wood@gmail.com','Caroline Wood','https://lh6.googleusercontent.com/-4zVXiJs_160/AAAAAAAAAAI/AAAAAAAAAGY/gJrnx0sQ38g/photo.jpg',1),(15,'albert.einstein@gmail.com','Albert Einstein','http://www.forwards.in/data/images/0313/1364181158_albert_einstein_rare_07.jpg',1),(16,'hawks@hotmail.com','Stephen Hawking','https://pbs.twimg.com/profile_images/96225201/me.jpg',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `avg_user_ratings`
--

/*!50001 DROP TABLE IF EXISTS `avg_user_ratings`*/;
/*!50001 DROP VIEW IF EXISTS `avg_user_ratings`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50001 VIEW `avg_user_ratings` AS select `responses`.`user_id` AS `user_id`,avg(`responses`.`rating`) AS `personal_avg` from `responses` group by `responses`.`user_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `max_avg_rating`
--

/*!50001 DROP TABLE IF EXISTS `max_avg_rating`*/;
/*!50001 DROP VIEW IF EXISTS `max_avg_rating`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50001 VIEW `max_avg_rating` AS select max(`avg_user_ratings`.`personal_avg`) AS `max` from `avg_user_ratings` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `user_ratings`
--

/*!50001 DROP TABLE IF EXISTS `user_ratings`*/;
/*!50001 DROP VIEW IF EXISTS `user_ratings`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50001 VIEW `user_ratings` AS select `avg_user_ratings`.`user_id` AS `user_id`,floor(((100 * `avg_user_ratings`.`personal_avg`) / `max_avg_rating`.`max`)) AS `rating` from (`avg_user_ratings` join `max_avg_rating`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-08-29 19:59:21
