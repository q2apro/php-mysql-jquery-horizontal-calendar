<?php
	header('Content-type: text/html; charset=utf-8');
	setlocale(LC_TIME, 'de_DE.UTF8');
	date_default_timezone_set('Europe/Berlin');

	// CONNECT TO DATABASE
	require_once('config.php');
	$db = mysqli_connect(DB_HOST, DB_USER, DB_PASS);
	mysqli_set_charset($db, 'utf8');
	mysqli_select_db($db, DB_NAME);

	/* REGIONS */
	$result = mysqli_query($db, 'SELECT id,country,region,meta FROM `holiday_countries` ORDER BY country, region');
	$regionNames = array();
	$regionIDs = array();
	$tArray = array();
	$allDays = array();
	$regionMeta = array();
	
	/* DATE PREPARATIONS */
	// http://php.net/manual/en/function.date.php
	$today = date('Y-m-d');
	
	$requYMD = $today; // makes it first of month
	$startpage = true;
	if(isset($_GET['m']))
    {
		$requYMD = preg_replace("/[^0-9\-]/i", '', $_GET['m']).'-01';
		$startpage = false;
	}
	// block hack, required yyyy-mm-dd
	if(strlen($requYMD)!=10)
    {
		exit();
	}
	
	// get current month
	$curMonthTS = strtotime($requYMD); // add 4 hours 
	$monthNr = date('n', $curMonthTS); // numeric representation of current month, without leading zeros
	// echo strftime('%s %H:%M:%S %z %Z %a., %d. %B %Y', $curMonthTS);
	
	// http://stackoverflow.com/questions/13346395/php-array-containing-all-dates-of-the-current-month
	// number of days in the given month
	$num_of_days = date('t', $curMonthTS);
	$x_year = date('Y', $curMonthTS);
	$x_month = date('m', $curMonthTS);
	for($i=1; $i<=$num_of_days; $i++) 
	{
		$dates[]= $x_year."-".$x_month."-".str_pad($i,2,'0', STR_PAD_LEFT);
	}
	
	// fill Arrays with data
	while($row = mysqli_fetch_assoc($result))
	{
		$id = $row['id'];
		// write regionids to each country
		$regionIDs[$row['country']][] = $id;
		$regionMeta[$id] = $row['meta'];
		$regionNames[$id] = $row['region'];
		$tArray[$id] = '';
		// create all days in month as array entries
		$d = 1; // id starts with 1, we dont have an id==0
		while($d <= $num_of_days) {
			$allDays[$id][$d] = ' ';
			$d++;
		}
	}
	
	// get all holiday periods by checking if month appears in startdate or enddate
	$result = mysqli_query($db, 'SELECT id,startdate,enddate,meta FROM `holiday_periods` 
							WHERE YEAR(`startdate`) = YEAR("'.$requYMD.'")
								AND MONTH(`startdate`) = MONTH("'.$requYMD.'")
								OR 
								YEAR(`enddate`) = YEAR("'.$requYMD.'")
								AND MONTH(`enddate`) = MONTH("'.$requYMD.'")
							ORDER BY `startdate`');

	while($row = mysqli_fetch_assoc($result)) 
    {
		// first entry without leading comma
		if($tArray[$row['id']]=='') {
			$tArray[$row['id']] .= $row['startdate'].','.$row['enddate'].','.$row['meta'];
		}
		else {
			$tArray[$row['id']] .= ','.$row['startdate'].','.$row['enddate'].','.$row['meta'];
		}
	}

	// extra query for regions with holidays over 2 months, e.g. 31.07.2014 - 10.09.2014
	$resultXX = mysqli_query($db, 'SELECT id,startdate,enddate,meta FROM `holiday_periods` 
							WHERE YEAR(`startdate`) = YEAR("'.$requYMD.'")
								AND MONTH(`startdate`) = MONTH("'.date('Y-m-d', strtotime($requYMD.' - 1 month')).'")
								AND 
								YEAR(`enddate`) = YEAR("'.$requYMD.'")
								AND MONTH(`enddate`) = MONTH("'.date('Y-m-d', strtotime($requYMD.' + 1 month')).'")
							ORDER BY `startdate`');
	while($row = mysqli_fetch_assoc($resultXX)) {
		// set holiday of region to full month setting first to end of month
		$tArray[$row['id']] = $requYMD.','.substr($requYMD,0,8).$num_of_days.','.$row['meta'];
	}
	
	/* OUTPUT function */
	function getAllHolidays($countryCode) 
    {
		global $dates;
		global $regionNames;
		global $regionIDs; // IDs of all regions
		global $tArray; // contains all holiday periods for each region
		global $allDays;
		global $regionMeta;
		global $today;
		global $requYMD;
		global $curMonthTS;
		global $monthNr;
		global $num_of_days;
		$allMetas = array();
		
		$output = '
	<table id="table_'.$countryCode.'" class="bordered">
	<tr>
		<th style="text-align:left !important;background:#FFD !important;">
		<span style="display:none;">Holidays in </span>'.strftime('%B %Y', $curMonthTS).'
		</th>
	';
		
		// all number days of current month
		foreach($dates as $day) {
			// set id for today to color the column, but only if showing this month
			$cssToday = '';
			if($day == $today && substr($today,5,2)==$monthNr) {
				$cssToday = ' class="today" title="Der heutige Tag!"';
			}
			// format 2013-10-01 to 01 and remove if necessary the 0 by ltrim
			$output .= '<th'.$cssToday.'>'.ltrim( substr($day,8,2) , '0').'</th>'; // alternative: output $day and let JS convert the day to weekday
		}
	$regionTerm = ($countryCode=='ch') ? 'Kantone' : 'Bundesländer';
	$output .= '
	</tr>
	
	<tr class="weekdays"><td><span style="display:none;">'.$regionTerm.'</span></td>';
		$wdaysMonth = array();
		// week days
		$i = 1;
		foreach($dates as $day) {
			// echo '<td>'.date('D', strtotime($day)).'</td>';
			$weekdayName = strftime('%a', strtotime($day));
			$wkendcss = '';
			$todayWDcss = '';
			//if($weekdayName=='Sa' || $weekdayName=='So'){
			if($day == $today) {
				$todayWDcss = 'class="activeday"';
			}
			else if($weekdayName=='So'){
				$wkendcss = 'class="wkend"';
			}
			// write day date in array field
			$wdaysMonth[$i++] = strftime('%A %e. %B %Y', strtotime($day));
			$output .= '<td '.$todayWDcss.$wkendcss.' title="'.strftime( '%A %e. %B %Y', strtotime($day) ).'">'.$weekdayName.'</td>';
		}
		
	$hasData = false;
	$output .= '
	</tr>
	';

		// go over all regions and display holidays
		foreach($regionIDs[$countryCode] as $id) 
        {
			// 3 items in a row belong together: startdate, enddate, meta
			$regionHolidays = explode(',',$tArray[$id]); 
			
			$output .= '<tr> <td><a title="Yearly holidays of '.$regionNames[$id].'<br />('.$regionMeta[$id].')" href="region.php?id='.$id.'">'.$regionNames[$id].'</a></td>';
			
			// start and end date is one loop
			$loops = count($regionHolidays);

			$i = 0;
			$entiremonthFree = false;
			while($i < $loops) {
				/* write holiday days into month for region */
				// compare month, e.g. if 09-25 to 10-01 or 05-20 to 05-25
				$startdate_year = substr($regionHolidays[$i],0,4);
				$startdate_month = substr($regionHolidays[$i],5,2);
				$startdate_day = substr($regionHolidays[$i],8,2);
				$enddate_year = substr($regionHolidays[$i+1],0,4);
				$enddate_month = substr($regionHolidays[$i+1],5,2);
				$enddate_day = substr($regionHolidays[$i+1],8,2);
				
				$day_start = 1;
				$day_end = $num_of_days; // 31;

				// end month outside current month, e.g. 2013-10* to 2013-11
				if( ($startdate_year == $enddate_year && $monthNr < $enddate_month) )
				{
					// last of months
					$day_end = $num_of_days;
					// extra check for period that goes over 2 months, e.g. 31.07.2014 - 13.09.2014
					// our month to be filled is not the start or the end month but between
					if($enddate_month-$startdate_month>1 && $monthNr!=$enddate_month && $monthNr!=$startdate_month)
					{
						// remember that next $month is free completely
						$entiremonthFree = true;
						$output .= '###';
					}
				}
				// end month outside current month, e.g. 2013-12* to 2014-01
				else if( ($startdate_year < $enddate_year && $monthNr > $enddate_month) )
                {
					// last of months
					$day_end = $num_of_days;
				}
				else 
                {
					// set end date of given month, remove leading zero
					$day_end = ltrim( substr($regionHolidays[$i+1],8,2), '0');
				}
				
				// start month outside current month, e.g. 2013-10 to 2013-11*
				if( ($startdate_year == $enddate_year && $monthNr > $startdate_month) )
                {
					// first of month
					$day_start = 1;
				}
				// start month outside current month, e.g. 2013-12 to 2014-01*
				else if( ($startdate_year < $enddate_year && $monthNr < $startdate_month) )
                {
					// first of months
					$day_start = 1;
				}
				else 
                {
					// date of start month, remove leading zero
					$day_start = ltrim( substr($regionHolidays[$i],8,2), '0');
					//echo $day_start;
				}
				
				if($entiremonthFree) {
					$day_end = $num_of_days;
					$day_start = 1;
				}
				
				// write holidays into array
				while($day_start<=$day_end) 
                {
					$allDays[$id][$day_start] = 'x';
					// write holiday meta into array
					$allMetas[$id][$day_start] = $regionHolidays[$i+2]; 
					$day_start++;
				}
				
				// jump to next data items
				$i+=3;
				$hasData = true;
			}

			$k = 0;
			foreach($allDays[$id] as $day) 
            {
				$k++;
				if($day=='x') 
                {
					$output .= '<td class="free" title="'.$wdaysMonth[$k].'<br />'.$allMetas[$id][$k].'">'.$day.'</td>';
				}
				else 
                {
					$output .= '<td>'.$day.'</td>';
				}
			}
			$output .= '</tr>
			';
		}
		
		$output .= '</table>';
		
		if(!$hasData) {
			$output = '<p>Oh no, no data for this period.</p>';
		}
		return $output;
	}
	
	// $mnthyear = strftime('%b %G', $curMonthTS);
	$mnthyear = strftime('%b %Y', $curMonthTS);
	
?><!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="author" content="Not me" />
	<meta name="robots" content="index,follow" />
	
	<title>Hoirzontal calendar</title>
	
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400" type="text/css" />
	<link rel="stylesheet" href="styles.css" type="text/css" />
	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<script>window.jQuery || document.write('<script src="/js/jquery/3.2.1/jquery.min.js"><\/script>')</script>
	
	<script type="text/javascript" src="script.js"></script>

</head>

<body class="holidaysm">

	<div id="nav">
		
		<div id="fastaccess">
		<?php
			// LIST Nav Buttons first or last 6 months of year - according to recent date year
			$requYear = substr($requYMD,0,4);
			$requMonth = substr($requYMD,5,2);
			$monthr = $requMonth<7 ? 1 : 7;
			$timestamp = $requYear.'-'.$monthr;
			
			$monthOut = array();
			$c = 0;
			$monthOut[$c][0] = date('Y-m', strtotime($timestamp));
			$monthOut[$c++][1] = strftime('%b %Y', strtotime($timestamp));
			$monthOut[$c][0] = date('Y-m', strtotime($timestamp.' +1 month')); // next month
			$monthOut[$c++][1] = strftime('%b %Y', strtotime($timestamp.' +1 month'));
			$monthOut[$c][0] = date('Y-m', strtotime($timestamp.' +2 month'));
			$monthOut[$c++][1] = strftime('%b %Y', strtotime($timestamp.' +2 month'));
			$monthOut[$c][0] = date('Y-m', strtotime($timestamp.' +3 month'));
			$monthOut[$c++][1] = strftime('%b %Y', strtotime($timestamp.' +3 month'));
			$monthOut[$c][0] = date('Y-m', strtotime($timestamp.' +4 month'));
			$monthOut[$c++][1] = strftime('%b %Y', strtotime($timestamp.' +4 month'));
			$monthOut[$c][0] = date('Y-m', strtotime($timestamp.' +5 month'));
			$monthOut[$c++][1] = strftime('%b %Y', strtotime($timestamp.' +5 month'));
			$c_out = 0;
			
		?>
			<a class="navpre" title="previous month" href="?m=<?php echo date('Y-m', strtotime($requYMD.' -1 month')); ?>">&laquo;</a> 
			<a <?php echo (substr($requYMD,0,7)==$monthOut[$c_out][0])? 'class="oranged" ' : '' ?>href="?m=<?php echo $monthOut[$c_out][0]; ?>"><?php echo $monthOut[$c_out++][1]; ?></a> 
			<a <?php echo (substr($requYMD,0,7)==$monthOut[$c_out][0])? 'class="oranged" ' : '' ?>href="?m=<?php echo $monthOut[$c_out][0]; ?>"><?php echo $monthOut[$c_out++][1]; ?></a> 
			<a <?php echo (substr($requYMD,0,7)==$monthOut[$c_out][0])? 'class="oranged" ' : '' ?>href="?m=<?php echo $monthOut[$c_out][0]; ?>"><?php echo $monthOut[$c_out++][1]; ?></a> 
			<a <?php echo (substr($requYMD,0,7)==$monthOut[$c_out][0])? 'class="oranged" ' : '' ?>href="?m=<?php echo $monthOut[$c_out][0]; ?>"><?php echo $monthOut[$c_out++][1]; ?></a> 
			<a <?php echo (substr($requYMD,0,7)==$monthOut[$c_out][0])? 'class="oranged" ' : '' ?>href="?m=<?php echo $monthOut[$c_out][0]; ?>"><?php echo $monthOut[$c_out++][1]; ?></a> 
			<a <?php echo (substr($requYMD,0,7)==$monthOut[$c_out][0])? 'class="oranged" ' : '' ?>href="?m=<?php echo $monthOut[$c_out][0]; ?>"><?php echo $monthOut[$c_out++][1]; ?></a> 
			<a class="navfwd" title="next month" href="?m=<?php echo date('Y-m', strtotime($requYMD.' +1 month')); ?>">&raquo;</a> 
			
			<a id="datepickbtn">Calender <input id="datepicker" name="request" type="text" value="<?php echo substr($requYMD,0,7); ?>" /></a>
			
		</div>
		
		<br />
		<div id="flags">
			<span style="padding-right:10px;">Anzeigen:</span>
			<div title="Deutschland" id="setDE" class="germany"></div> 
			<div title="Österreich" id="setAT" class="austria"></div> 
			<div title="Schweiz" id="setCH" class="swiss1">
			<div class="swiss2"></div>
			</div> 
		</div>

		<div id="calholdr">
			<div class="calendar"><?php echo substr($today,8,2); ?><em><?php echo strftime('%b %Y', strtotime($today)); ?></em></div>
			<div id="clock"></div>
		</div>
		
	</div>
		
	<div id="main">
	
		<div class="tabcont t_de">
			<h1>Holidays in Germany (<?php echo $mnthyear; ?>)</h1>
			<?php
				// output holiday table for Germany
				echo getAllHolidays('de');
			?>
		</div> 
		
		<div class="tabcont t_at">
			<!-- <div class="austria floatleft"></div> -->
			<h1>Holidays in Austria (<?php echo $mnthyear; ?>)</h1>
			<?php
				// output holiday table for Austria
				echo getAllHolidays('at');
			?>
		</div>
		
		<div class="tabcont t_ch">
			<!-- <div class="swiss1 floatleft"><div class="swiss2"></div></div> -->
			<h1>Holidays in Switzerland (<?php echo $mnthyear; ?>)</h1>
			<?php
				// output holiday table for Switzerland
				echo getAllHolidays('ch');
			?>
		</div>

	</div>
	
</body>
</html>