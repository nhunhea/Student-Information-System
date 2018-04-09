-- MySQL dump 10.13  Distrib 5.7.21, for osx10.13 (x86_64)
--
-- Host: localhost    Database: mydb
-- ------------------------------------------------------
-- Server version	5.7.21

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
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `studentID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `address` varchar(255) NOT NULL,
  `gender` enum('F','M') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `date_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(60) NOT NULL,
  PRIMARY KEY (`studentID`)
) ENGINE=InnoDB AUTO_INCREMENT=18009 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (14,'Annabelle Sucipto','Jl Mangkubumi no. 29','F','1999-12-13','2018-01-12 00:00:00','annabelle@gmail.com'),(16,'Diana Sinta W','Jl Gejayan 09 Yogyakarta','F','1999-02-22','2018-01-19 00:00:00','diana@gmail.com'),(17,'Amanda Putri','Jl Arum Manis','F','1999-08-08','2018-01-01 00:00:00','amanda@gmail.com'),(18,'Alvaro Putra','Jl Gejayan 112','M','1999-09-19','2018-03-11 20:28:18','alvaro@gmail.com'),(20,'Anindi Pratiwi','Jl. Magelang no. 25 Yogyakarta','F','1999-09-09','2018-03-12 00:00:00','anindi@gmail.com'),(21,'Dion Rumbaka','Jl. Colombo no. 17 Yogyakarta','M','1999-08-21','2018-03-13 10:16:47','dion@gmail.com'),(22,'Ratna Sari Dewi','Jl. Laksda Adi Sucipto no. 8','F','1999-03-11','2018-03-13 10:17:18','ratna@gmail.com'),(18002,'Melati Kusuma','Jl Cempaka no 11 Yogyakarta','F','1999-04-04','2018-03-13 11:27:23','melati@gmail.com'),(18003,'Nuansa Pagi','Jl Afandi no 45 Yogyakarta','M','2018-08-07','2018-03-13 11:36:41','nuansa@gmail.com'),(18004,'John Len','Jl Manunggal no 6','M','1999-11-12','2018-03-13 16:28:46','johnlenon@gmail.com'),(18005,'Murni Sentosa','Jl Perkutut no 23','F','1999-01-01','2018-03-14 15:50:08','murni@gmail.com'),(18006,'Thomas Runner','JL Ayam Jago','M','1999-11-11','2018-03-14 16:54:23','thomas@gmail.com'),(18007,'Maya Septha','Jl Jakarta','F','1998-06-01','2018-03-14 17:04:53','maya.s@gmail.com'),(18008,'Entis Sutisna','Jl Bandung no 11','M','1998-11-12','2017-01-01 00:00:00','sule@gmail.com');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(150) NOT NULL,
  `password` varchar(150) NOT NULL,
  `user_email` varchar(150) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `expired` datetime DEFAULT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','84161755168f596800dd9e9d19b8537818dfe119','evan.nhea@gmail.com',NULL,NULL),(2,'eva','4de6c29ec17a9b735f00ec365e9c3adb60690635','admin2@gmail.com',NULL,NULL),(3,'admin2','79d5f22eeb7a94c331a06717b7eea0459b19c265','nhea@gmail.com',NULL,NULL),(4,'nhea','4de6c29ec17a9b735f00ec365e9c3adb60690635','nheaa@gmail.com',NULL,NULL),(5,'Lia','ceb50fa71d130ad79eb2b31661989fed8e8ffbb4','lia@gmail.com',NULL,NULL),(6,'azma','f79ae7a14e2359edeefaa59c8572b9c55fc74377','azm.sholihah@gmail.com','15911fa673fb73eabe2e3627b86e215f05a06093','2018-03-20 11:07:13'),(7,'anda','7b284b8c695d4405364ef86e5761a3c10012a239','anda@gmail.com',NULL,NULL),(9,'Lina','755a7ecd0f45d9b81994d78dcb90c99bda6f0b20','lina@gmail.com',NULL,NULL),(10,'dina','9b6680ce5aa7dcfbfc6f2a8d7fe39d91fa9dd724','dina@gmail.com',NULL,NULL),(11,'mirna','a47a5acb5e6ac5d39d0536e36c4bac2b4f180b1f','mirna@gmail.com',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-04 11:48:25
