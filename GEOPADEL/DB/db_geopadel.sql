-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-11-2018 a las 18:33:47
-- Versión del servidor: 10.1.26-MariaDB
-- Versión de PHP: 7.1.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_geopadel`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horari_pistes`
--

CREATE TABLE `horari_pistes` (
  `horari_pistes_id` int(5) NOT NULL,
  `horari_pistes_dies` int(7) NOT NULL,
  `horari_pistes_hores` int(5) NOT NULL,
  `horari_pistes_pistes_id` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `levels`
--

CREATE TABLE `levels` (
  `levels_id` int(5) NOT NULL,
  `levels_desc` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `levels`
--

INSERT INTO `levels` (`levels_id`, `levels_desc`) VALUES
(0, 'Null'),
(1, 'Avançat'),
(2, 'Normal'),
(3, 'Principiant');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partides`
--

CREATE TABLE `partides` (
  `partides_id` int(5) NOT NULL,
  `partides_desc` varchar(50) NOT NULL,
  `partides_num_jugadors` int(5) NOT NULL,
  `partides_pistes_id` int(5) NOT NULL,
  `partides_levels_id` int(5) NOT NULL,
  `partides_data` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partides_users`
--

CREATE TABLE `partides_users` (
  `partides_users_id` int(5) NOT NULL,
  `partides_users_users_id` int(5) NOT NULL,
  `partides_users_partides_id` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pistes`
--

CREATE TABLE `pistes` (
  `pistes_id` int(5) NOT NULL,
  `pistes_desc` varchar(50) NOT NULL,
  `pistes_users_id` int(11) NOT NULL,
  `pistes_situacio` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `users_id` int(11) NOT NULL,
  `users_first_name` varchar(50) NOT NULL,
  `users_last_name` varchar(50) NOT NULL,
  `users_username` varchar(50) NOT NULL,
  `users_levels_id` int(5) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `horari_pistes`
--
ALTER TABLE `horari_pistes`
  ADD PRIMARY KEY (`horari_pistes_id`),
  ADD KEY `fk_horari_pistes_id` (`horari_pistes_pistes_id`);

--
-- Indices de la tabla `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`levels_id`);

--
-- Indices de la tabla `partides`
--
ALTER TABLE `partides`
  ADD PRIMARY KEY (`partides_id`),
  ADD KEY `fk_partides_id` (`partides_pistes_id`),
  ADD KEY `fk_partides_levels_id` (`partides_levels_id`);

--
-- Indices de la tabla `partides_users`
--
ALTER TABLE `partides_users`
  ADD PRIMARY KEY (`partides_users_id`),
  ADD KEY `fk_partides_users` (`partides_users_users_id`),
  ADD KEY `fk_partides_users_partides` (`partides_users_partides_id`);

--
-- Indices de la tabla `pistes`
--
ALTER TABLE `pistes`
  ADD PRIMARY KEY (`pistes_id`),
  ADD KEY `fk_pistess_users_id` (`pistes_users_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`users_id`),
  ADD KEY `fk_users_levels_id` (`users_levels_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `horari_pistes`
--
ALTER TABLE `horari_pistes`
  MODIFY `horari_pistes_id` int(5) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `partides`
--
ALTER TABLE `partides`
  MODIFY `partides_id` int(5) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `partides_users`
--
ALTER TABLE `partides_users`
  MODIFY `partides_users_id` int(5) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `pistes`
--
ALTER TABLE `pistes`
  MODIFY `pistes_id` int(5) NOT NULL AUTO_INCREMENT;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `horari_pistes`
--
ALTER TABLE `horari_pistes`
  ADD CONSTRAINT `fk_horari_pistes_id` FOREIGN KEY (`horari_pistes_pistes_id`) REFERENCES `pistes` (`pistes_id`);

--
-- Filtros para la tabla `partides`
--
ALTER TABLE `partides`
  ADD CONSTRAINT `fk_partides_id` FOREIGN KEY (`partides_pistes_id`) REFERENCES `pistes` (`pistes_id`),
  ADD CONSTRAINT `fk_partides_levels_id` FOREIGN KEY (`partides_levels_id`) REFERENCES `levels` (`levels_id`);

--
-- Filtros para la tabla `partides_users`
--
ALTER TABLE `partides_users`
  ADD CONSTRAINT `fk_partides_users` FOREIGN KEY (`partides_users_users_id`) REFERENCES `users` (`users_id`),
  ADD CONSTRAINT `fk_partides_users_partides` FOREIGN KEY (`partides_users_partides_id`) REFERENCES `partides` (`partides_id`);

--
-- Filtros para la tabla `pistes`
--
ALTER TABLE `pistes`
  ADD CONSTRAINT `fk_pistess_users_id` FOREIGN KEY (`pistes_users_id`) REFERENCES `users` (`users_id`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_levels_id` FOREIGN KEY (`users_levels_id`) REFERENCES `levels` (`levels_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
