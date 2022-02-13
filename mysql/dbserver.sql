-- MySQL dump 10.13  Distrib 8.0.27, for macos12.0 (arm64)
--
-- Host: localhost    Database: dbsrv
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Action`
--

DROP TABLE IF EXISTS `Action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Action` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Action` varchar(50) NOT NULL,
  `Argument` varchar(20) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Action`
--

LOCK TABLES `Action` WRITE;
/*!40000 ALTER TABLE `Action` DISABLE KEYS */;
INSERT INTO `Action` VALUES (1,'on','--on'),(2,'get the value','--get'),(3,'off','--off'),(4,'waiting','wait'),(5,'set infusion rate','--irate'),(6,'set withdraw rate','--wrate'),(7,'infusion run','--irun'),(8,'withdraw run','--wrun');
/*!40000 ALTER TABLE `Action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ActualDevice`
--

DROP TABLE IF EXISTS `ActualDevice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ActualDevice` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `RunID` int NOT NULL,
  `ProcedureID` int NOT NULL,
  `DeviceID` int NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ActualDevice`
--

LOCK TABLES `ActualDevice` WRITE;
/*!40000 ALTER TABLE `ActualDevice` DISABLE KEYS */;
/*!40000 ALTER TABLE `ActualDevice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Experiment`
--

DROP TABLE IF EXISTS `Experiment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Experiment` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(256) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Experiment`
--

LOCK TABLES `Experiment` WRITE;
/*!40000 ALTER TABLE `Experiment` DISABLE KEYS */;
INSERT INTO `Experiment` VALUES (1,'test1'),(2,'example1'),(20,'pump test');
/*!40000 ALTER TABLE `Experiment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Experimentalprocedure`
--

DROP TABLE IF EXISTS `Experimentalprocedure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Experimentalprocedure` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ExperimentID` int NOT NULL,
  `Device` varchar(50) NOT NULL DEFAULT '-',
  `ActionID` int NOT NULL,
  `ProcedureOrder` int NOT NULL,
  `Details` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Experimentalprocedure`
--

LOCK TABLES `Experimentalprocedure` WRITE;
/*!40000 ALTER TABLE `Experimentalprocedure` DISABLE KEYS */;
INSERT INTO `Experimentalprocedure` VALUES (1,1,'aq',1,3,NULL),(2,1,'bq',1,2,NULL),(3,1,'cq',3,4,NULL),(4,2,'deviceX',1,1,NULL),(5,1,'aq',3,1,NULL),(6,2,'deviceX',2,2,NULL),(7,2,'deviceX',2,4,NULL),(8,19,'a',1,1,NULL),(9,2,'-',4,3,'2'),(10,19,'a',2,2,NULL),(11,2,'-',4,5,'3'),(44,19,'hgoehoge',4,44,'hogehoge'),(45,1,'aq',6,45,' '),(46,1,'aq',6,46,'5 m/m'),(47,1,'qazwsx',7,47,' '),(48,1,'cq',7,48,' '),(49,1,'-',4,49,'16 '),(50,20,'a',6,50,'2 m/m'),(51,20,'a',7,51,' ');
/*!40000 ALTER TABLE `Experimentalprocedure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Result`
--

DROP TABLE IF EXISTS `Result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Result` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `RunID` int NOT NULL,
  `ProcedureID` int NOT NULL,
  `Time` time NOT NULL,
  `Value` float NOT NULL,
  `Unit` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Result`
--

LOCK TABLES `Result` WRITE;
/*!40000 ALTER TABLE `Result` DISABLE KEYS */;
/*!40000 ALTER TABLE `Result` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Run`
--

DROP TABLE IF EXISTS `Run`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Run` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ExperimentID` int NOT NULL,
  `Starting_date` datetime DEFAULT NULL,
  `Comment` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Run`
--

LOCK TABLES `Run` WRITE;
/*!40000 ALTER TABLE `Run` DISABLE KEYS */;
INSERT INTO `Run` VALUES (1,2,'2021-11-14 01:25:40',NULL),(2,2,'2021-11-14 01:25:40',NULL),(3,2,'2021-11-14 01:49:53',NULL),(4,2,'2021-11-14 01:54:18',NULL),(5,2,'2021-11-14 01:57:55',NULL),(6,2,'2021-11-14 02:00:07',NULL),(7,2,'2021-11-14 02:01:33',NULL),(8,2,'2021-11-14 14:21:37',NULL),(9,1,'2021-11-14 14:37:53',NULL),(10,2,'2021-11-14 23:48:28',NULL),(11,2,'2021-11-14 23:51:31',NULL),(12,2,'2021-11-14 23:51:50',NULL),(13,2,'2021-11-15 01:01:58',NULL),(14,2,'2021-11-15 01:05:56',NULL),(15,2,'2021-11-15 01:09:39',NULL),(16,2,'2021-11-15 01:46:13',NULL),(17,2,'2021-11-15 02:47:50',NULL),(18,2,'2021-11-15 03:31:49','あいうえお'),(19,2,'2021-11-15 04:17:35','ああああ'),(20,2,'2021-11-15 05:26:40',NULL),(21,2,'2021-11-15 13:55:49',NULL),(22,2,'2021-11-16 15:33:25',NULL),(23,2,'2021-11-24 15:31:25','あいうえお'),(24,2,'2021-11-24 15:31:57',NULL),(25,2,'2021-11-24 15:32:01',NULL),(26,2,'2021-11-24 15:53:56',NULL),(27,2,'2021-11-24 15:54:53',NULL),(28,2,'2021-11-24 16:07:06',NULL),(29,2,'2021-11-24 16:09:58',NULL),(30,19,'2021-11-24 18:06:19',NULL),(31,19,'2021-11-24 18:11:38',NULL),(32,19,'2021-11-24 18:15:11',NULL),(33,2,'2021-11-24 18:26:37',NULL),(34,2,'2021-11-24 18:37:12',NULL),(35,2,'2021-11-24 18:39:24',NULL),(36,2,'2021-11-24 18:40:33',NULL),(37,2,'2021-11-24 18:43:49',NULL),(38,2,'2021-11-24 18:43:55',NULL),(39,19,'2021-11-24 18:50:08',NULL),(40,19,'2021-11-24 18:50:38',NULL),(41,2,'2021-12-01 13:05:12',NULL),(42,20,'2021-12-01 13:29:09',NULL),(43,20,'2021-12-01 13:36:35',NULL),(44,20,'2021-12-01 13:37:16',NULL),(45,2,'2021-12-07 01:08:53',NULL),(46,2,'2021-12-09 00:24:44',NULL),(47,2,'2021-12-09 12:58:10',NULL),(48,2,'2021-12-09 13:02:58',NULL),(49,2,'2021-12-09 17:07:54',NULL),(50,2,'2021-12-09 17:08:33',NULL),(51,2,'2021-12-10 00:59:38',NULL),(52,2,'2021-12-10 01:01:58',NULL),(53,2,'2021-12-10 01:04:24',NULL),(54,2,'2021-12-10 01:09:16',NULL),(55,2,'2021-12-10 01:13:29',NULL),(56,2,'2021-12-14 15:33:21',NULL),(57,19,'2021-12-14 15:48:22',NULL),(58,1,'2021-12-14 23:43:47','いろいろありすぎて難しい'),(59,1,'2021-12-16 03:23:29',NULL),(60,2,'2021-12-17 14:29:54',NULL),(61,2,'2021-12-18 12:50:32',NULL),(62,1,'2021-12-18 22:50:34',NULL),(63,2,'2021-12-18 22:56:33',NULL),(64,2,'2021-12-18 23:14:44',NULL),(65,2,'2021-12-18 23:25:50',NULL),(66,2,'2022-01-07 23:51:20',NULL),(67,2,'2022-01-09 15:57:44',NULL),(68,2,'2022-01-09 15:58:13',NULL),(69,1,'2022-01-09 19:36:01',NULL),(70,2,'2022-01-09 19:36:23',NULL),(71,1,'2022-01-12 13:41:01',NULL),(72,2,'2022-01-12 16:07:47',NULL),(73,2,'2022-01-12 17:19:48',NULL),(74,2,'2022-01-23 22:47:07',NULL),(75,2,'2022-01-23 22:48:16',NULL),(76,2,'2022-01-23 23:19:15',NULL),(77,2,'2022-02-07 21:07:39',NULL),(78,2,'2022-02-07 21:10:21',NULL),(79,1,'2022-02-08 16:31:06',NULL),(80,2,'2022-02-08 17:01:05',NULL),(81,20,'2022-02-08 17:08:58',NULL);
/*!40000 ALTER TABLE `Run` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Username`
--

DROP TABLE IF EXISTS `Username`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Username` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Mail` varchar(50) DEFAULT NULL,
  `Belongs` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Username`
--

LOCK TABLES `Username` WRITE;
/*!40000 ALTER TABLE `Username` DISABLE KEYS */;
/*!40000 ALTER TABLE `Username` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-14  2:19:38
