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
) ENGINE=InnoDB AUTO_INCREMENT=18004 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (14,'Annabelle Sucipto','Jl Mangkubumi no. 29','F','1999-12-13','2018-01-12 00:00:00','annabelle@gmail.com'),(16,'Diana Sinta W','Jl Gejayan 09 Yogyakarta','F','1999-02-22','2018-01-19 00:00:00','diana@gmail.com'),(17,'Amanda Putri','Jl Arum Manis','F','1999-08-08','2018-02-20 00:00:00','amanda@gmail.com'),(18,'Alvaro Putra','Jl Gejayan 112','M','1999-09-19','2018-03-11 20:28:18','alvaro@gmail.com'),(20,'Anindi Pratiwi','Jl. Magelang no. 25 Yogyakarta','F','1999-09-09','2018-03-12 00:00:00','anindi@gmail.com'),(21,'Dion Rumbaka','Jl. Colombo no. 17 Yogyakarta','M','1999-08-21','2018-03-13 10:16:47','dion@gmail.com'),(22,'Ratna Sari Dewi','Jl. Laksda Adi Sucipto no. 8','F','1999-03-11','2018-03-13 10:17:18','ratna@gmail.com'),(23,'Angga Maulana','Jl Mangga no 12 Yogyakarta','M','1999-01-12','2018-03-13 10:17:45','angga@gmail.com'),(18002,'Melati Kusuma','Jl Cempaka no 11 Yogyakarta','F','1999-04-04','2018-03-13 11:27:23','melati@gmail.com'),(18003,'Nuansa Pagi','Jl Afandi no 45 Yogyakarta','M','2018-08-07','2018-03-13 11:36:41','nuansa@gmail.com');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-03-13 14:55:35
