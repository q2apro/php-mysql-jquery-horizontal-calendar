<?php
	header('Content-type: text/html; charset=utf-8');
	setlocale(LC_TIME, 'de_DE.UTF8');
	date_default_timezone_set('Europe/Berlin');

	// CONNECT TO DATABASE
	require_once('config.php');
	$db = mysqli_connect(DB_HOST, DB_USER, DB_PASS);
	mysqli_set_charset($db, 'utf8');
	mysqli_select_db($db, DB_NAME);

	/* DATE PREPARATIONS */
	$today = date('Y-m-d');
	
	$requY = date('Y'); // this year by default
	if(isset($_GET['y'])) 
	{
		$requY = preg_replace("/[^0-9\-]/i", '', $_GET['y']);
	}
	$reg = 0; // no default region, if requested directly do not display region but region choice
	if(isset($_GET['id'])) 
	{
		$reg = preg_replace("/[^0-9]/i", '', $_GET['id']);
	}
	// block hack, required yyyy-mm-dd
	if(strlen($requY)!=4 || strlen($reg)>2) 
	{
		exit();
	}
	
	// Query region names
	$result = mysqli_query($db, 'SELECT id,country,region,meta FROM `holiday_countries`');
	$regName = '';
	$country = '';
	$allRegions = array();
	$allRegionsIDs = array();
	while($row = mysqli_fetch_assoc($result))
	{
		if($row['id']==$reg) {
			$regName = $row['region'];
			$country = $row['country'];
		}
		// save all regions for navigation
		$allRegions[ $row['country'] ][] = $row['region'];
		$allRegionsIDs[ $row['region'] ] = $row['id'];
	}
	
	if($reg!=0)
	{
		// Query to get all holiday periods of region in the requested year
		$result = mysqli_query($db, 'SELECT id,startdate,enddate,meta FROM `holiday_periods` 
								WHERE id="'.$reg.'" AND YEAR(`startdate`) = YEAR("'.$requY.'-01-01'.'")
								OR id="'.$reg.'" AND YEAR(`enddate`) = YEAR("'.$requY.'-01-01'.'")
								ORDER BY `startdate`');
		
		$tString = '';
		$listholidays = '<ul>';
		while($row = mysqli_fetch_assoc($result))
		{
			$holidaysmeta = $row['meta'];
			$bgcss = '';
			// do we have holidays in meta, then we color the background
			if(strpos($row['meta'],'holidays') !== false) {
				$bgcss = ' class="txthbg"';
			}
			
			if($row['startdate']==$row['enddate']){
				// display text for one day
				$listholidays .= '<li><span'.$bgcss.'>'.date('d.m.Y', strtotime($row['startdate'])).' '.$holidaysmeta.'</span></li>';
			}
			else {
				// display text for time frame
				$listholidays .= '<li><span'.$bgcss.'>'.date('d.m.Y', strtotime($row['startdate'])).' - '.date('d.m.Y', strtotime($row['enddate'])).' '.$holidaysmeta.'</span></li>';
			}
			if($tString=='') {
				// first entry without leading comma
				$tString .= $row['startdate'].','.$row['enddate'].','.$row['meta'];
			}
			else {
				$tString .= ','.$row['startdate'].','.$row['enddate'].','.$row['meta'];
			}
		}
		$listholidays .= '</ul>';
	}

	$allDays = array();
	
	// https://stackoverflow.com/questions/13346395/php-array-containing-all-dates-of-the-current-month
	// all 12 months and dates of requested year
	for($m=1; $m<=12; $m++)
	{
		$num_of_days = date('t', strtotime($requY.'-'.$m));
		for($i=1; $i<=$num_of_days; $i++)
		{
			// fill each month with dates
			$dates[$m][] = $requY."-".str_pad($m,2,'0', STR_PAD_LEFT)."-".str_pad($i,2,'0', STR_PAD_LEFT);
			// create each day of month with empty days
			$allDays[$m][] = ' ';
		}
	}
	
	/* OUTPUT function */
	function getAllHolidaysOfRegion()
	{
		global $requY;
		global $today;
		global $tString; // contains all holiday periods for this region in one comma-separated string
		global $dates;
		global $allDays;
		global $country;
		$allMetas = array();
		
		$output = '';
		$nextmonthoff = false;
		
		foreach($dates as $month => $daysOfMonth) {
			$loopYearMD = $requY.'-'.str_pad($month,2,'0', STR_PAD_LEFT).'-01';
			
			$output .= '<p style="font-weight:bold;"><span style="display:none;">holidays im </span>'.strftime('%B %Y', strtotime($loopYearMD)).'</p>';
			
			$output .= '
		<table class="bordered">
		<tr>';
			// $output .= count($daysOfMonth);
			$cellcount = 0;
			// all number days of current month
			foreach($daysOfMonth as $day) {
				// set id for today to color the column if today
				$cssToday = '';
				if($day == $today && substr($today,0,4)==$requY && substr($today,5,2)==$month) {
					$cssToday = ' class="today" title="Der heutige Tag!"';
				}
				// format 2013-10-01 to 01 and remove if necessary the 0 by ltrim
				$output .= '<th'.$cssToday.'>'.ltrim(substr($day,8,2), '0').'</th>';
				$cellcount++;
			}
			// fill table td to 31 for aligning below each other
			while($cellcount<31) {
				$output .= '<th class="filler">&nbsp;</th>';
				$cellcount++;
			}

			$regionTerm = ($country=='ch') ? 'Kantone' : 'Bundesländer';
			
			$output .= '
			</tr>
			
			<tr class="weekdays">';
			$wdaysMonth = array();
			// week days
			$i = 1;
			$cellcount = 0;
			foreach($daysOfMonth as $day) {
				$weekdayName = strftime('%a', strtotime($day));
				$wkendcss = '';
				$todayWDcss = '';
				if($day == $today) {
					$todayWDcss = 'class="activeday"';
				}
				else if($weekdayName=='So'){
					$wkendcss = ' class="wkend"';
				}
				// write day date in array field
				$wdaysMonth[$month][$i++] = strftime('%A %e. %B %Y', strtotime($day));
				$output .= '<td '.$todayWDcss.$wkendcss.' title="'.strftime( '%A %e. %B %Y', strtotime($day) ).'">'.$weekdayName.'</td>';
				$cellcount++;
			}
			// var_dump($wdaysMonth);
			
			// fill table td to 31 for aligning below each other
			while($cellcount<31) {
				$output .= '<td class="filler">&nbsp;</td>';
				$cellcount++;
			}

			$hasData = false;
			$output .= '
			</tr>
			';
			
			$output .= '<tr>';
			$k = 0;
			// go over month days and display holidays
			$numofdays = date('t', strtotime($requY.'-'.$month));

			// 3 items in a row belong together: startdate, enddate, meta
			$regionholidays = explode(',',$tString);
			
			// check holidays of only this month! $regionholidays contains ALL holidays for the year
			
			// start and end date is one loop, we increment $i by 3
			$loops = count($regionholidays);

			$i = 0;
			
			// flag has been set that full month is free
			if($nextmonthoff) {
				$day_start = 1;
				$day_end = $numofdays; // 31
				while($day_start<=$day_end) {
					$allDays[$month][$day_start] = 'x';
					// write holiday meta into array
					$allMetas[$month][$day_start] = $regionholidays[$i+2]; 
					$day_start++;
				}
				$nextmonthoff = false;
			}
			else
			{				
				while($i < $loops) 
				{
					// write holidays days into month for region
					// compare month, e.g. if 09-25 to 10-01 or 05-20 to 05-25
					$startdate_year = substr($regionholidays[$i],0,4);
					$startdate_month = substr($regionholidays[$i],5,2);
					$startdate_day = substr($regionholidays[$i],8,2);
					$enddate_year = substr($regionholidays[$i+1],0,4);
					$enddate_month = substr($regionholidays[$i+1],5,2);
					$enddate_day = substr($regionholidays[$i+1],8,2);
					
					// is our startdate or our enddate in current month
					if( ($month == ltrim($startdate_month, '0') && $startdate_year==$requY) 
						  || ($month == ltrim($enddate_month, '0') && $enddate_year==$requY) ) {
						$day_start = 1;
						$day_end = $numofdays; // 31
						
						// end month outside current month, e.g. 2013-10* to 2013-11 OR 2013-12 to 2014-01
						if( ($startdate_year == $enddate_year && $month < $enddate_month) ){
							// last of months
							$day_end = $numofdays;
							// extra check for period that goes over 2 months, e.g. 31.07.2014 - 13.09.2014
							if($enddate_month-$startdate_month>1) {
								// remember that next $month is free completely
								$nextmonthoff = true;
							}
						}
						// end month outside current month, e.g. 2013-12* to 2014-01
						else if( ($startdate_year < $enddate_year && $month > $enddate_month) ){
							// last of months
							$day_end = $numofdays;
						}
						//  || ($startdate_year < $enddate_year && $month > $enddate_month) 
						else {
							// set end date of given month, remove leading zero
							$day_end = ltrim( substr($regionholidays[$i+1],8,2), '0');
						}
						
						// start month outside current month, e.g. 2013-10 to 2013-11*
						if( ($startdate_year == $enddate_year && $month > $startdate_month) ){
							// first of month
							$day_start = 1;
						}
						// start month outside current month, e.g. 2013-12 to 2014-01*
						else if( ($startdate_year < $enddate_year && $month < $startdate_month) ){
							// first of months
							$day_start = 1;
						}
						else {
							// date of start month, remove leading zero
							$day_start = ltrim( substr($regionholidays[$i],8,2), '0');
							//echo $day_start;
						}
						//$output .= $startdate_year .'<'. $enddate_year .'&&'. $month .'<'. $startdate_month.'<br />';
						//$output .= 'From: '.$day_start.' to: '.$day_end.'<br />';
						
						// write holidays into array
						while($day_start<=$day_end) {
							$allDays[$month][$day_start] = 'x';
							// write holiday meta into array
							$allMetas[$month][$day_start] = $regionholidays[$i+2]; 
							$day_start++;
						}
						
						$hasData = true;
					}
					// jump to next data items
					$i+=3;
				} // end while
				
			} // end else

			// output marked holidays fields
			$cellcount = 0;
			foreach($daysOfMonth as $day) {
				$daynr = ltrim( substr($day,8,2),'0');
				if($allDays[$month][$daynr]=='x') {
					$output .= '<td class="free" title="'.$wdaysMonth[$month][$daynr].'<br />'.$allMetas[$month][$daynr].'">x</td>';
				}
				else {
					//$output .= '<td>'.$day.'</td>';
					//$output .= '<td>'.ltrim( substr($day,8,2), '0').'</td>';
					$output .= '<td>&nbsp;</td>';
				}
				$cellcount++;
			}
			// fill table td to 31 for aligning below each other
			while($cellcount<31) {
				$output .= '<td>&nbsp;</td>';
				$cellcount++;
			}
			$output .= '</tr>';

			$output .= '</table>';
			
		} // end foreach
		
		return $output;
	}

?><!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="author" content="Not me">
	<meta name="robots" content="index,follow" />
	
	<title>Holiday Calendar by Region</title>
	
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400" type="text/css" />
	<link rel="stylesheet" href="styles.css" type="text/css" />
	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<script>window.jQuery || document.write('<script src="/js/jquery/3.2.1/jquery.min.js"><\/script>')</script>
	
	<script type="text/javascript" src="script.js"></script>

	<?php 
		if($reg==0) {?>
			<style type="text/css">
				#regionsNav {
					display:block;
				}
			</style>
		<?php }
	?>
</head>

<body class="regionb">

	<div id="nav">
			
		<div id="changeRegion" class="btngray" style="margin-right:30px;">Choose region <span id="arrowud">&#x25BC;</span></div>

		<div id="yearchoice">
			<span style="font-weight:bold;padding-right:10px;">Jahr:</span>
	
			<div id="fastaccess">
			<?php
				// LIST Nav Buttons according to recent date
				$yearOut = array(2015,2016,2017,2018);
				foreach($yearOut as $year)
				{
					echo '<a '.($requY==$year?'class="oranged" ':'').'href="?y='.$year.($reg==0 ? '' : '&amp;id='.$reg).'">'.$year.'</a> ';
				}
			?>
			</div>
		</div>
		
		<a class="btnblue nav_back_months" href="/holidays/">zurück zur Monatsübersicht</a>
		
		<div id="calholdr">
			<div class="calendar"><?php echo substr($today,8,2); ?><em><?php echo strftime('%b %Y', strtotime($today)); ?></em></div>
			<div id="clock"></div>
		</div>
		<br />
	
		<?php 
			if($regName!=''){
				echo '<span id="recentRegion">Chosen Holidays: '.$regName.' '. $requY.'</span>';
			}
		?>
		
		<div id="regionsNav">
			<div class="flagg"><div id="setDE" class="germany"></div> Germany: </div>
			<?php
				foreach($allRegions['de'] as $region) {
					$xcss = '';
					if($region==$regName) {
						$xcss = 'class="oranged" ';
					}
					echo '<a '.$xcss.'href="region.php?y='.$requY.'&amp;id='.$allRegionsIDs[$region].'">'.$region.'</a> ';
				}
			?>
			<br />
			
			<div class="flagg"><div id="setAT" class="austria"></div> Austria: </div>
			<?php
				foreach($allRegions['at'] as $region) {
					$xcss = '';
					if($region==$regName) {
						$xcss = 'class="oranged" ';
					}
					echo '<a '.$xcss.'href="region.php?y='.$requY.'&amp;id='.$allRegionsIDs[$region].'">'.$region.'</a> ';
				}
			?>
			<br />
			
			<div class="flagg"><div id="setCH" class="swiss1"><div class="swiss2"></div></div> Siwtzerland: </div>
			<?php
				foreach($allRegions['ch'] as $region) {
					$xcss = '';
					if($region==$regName) {
						$xcss = 'class="oranged" ';
					}
					echo '<a '.$xcss.'href="region.php?y='.$requY.'&amp;id='.$allRegionsIDs[$region].'">'.$region.'</a> ';
				}
			?>
			
		</div>
		
	</div>

	<div id="main">
	
		<div class="tabcont t_de">
			<?php 
				if($reg!=0)
				{
					echo '<h1><a href="https://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'].'">'.$regName.' - Holidays for year '.$requY.'</a></h1>';
				}
				else
				{
					// echo '<h1>Jahreskalender für das Jahr '.$requY.'</h1>';
					echo '<h1><a href="https://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'].'">Yearly calendar for year '.$requY.'</a></h1>';
				}
				
				// output holiday table for entire year for the region
				echo getAllHolidaysOfRegion();
			?>
		</div>
		
		<?php
			if($reg!=0) 
			{
				echo '<p style="font-weight:bold;margin-top:50px;">Overview Holidays '.$regName.' in '.$requY.':</p>';
			}			
			echo $listholidays;
			
		?>
		
	</div>
</body>
</html>
