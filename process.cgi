#!"c:\xampp\perl\bin\perl.exe"
#Change as per the path for perl
use DBI;
use strict;
use warnings FATAL => 'all';
use CGI qw();
use CGI::Carp 'fatalsToBrowser';
use JSON;
use Time::Piece;


#Database connection details, change as per needed
my $driver = "mysql"; 
my $database = "appointment";
my $dsn = "DBI:$driver:database=$database";
my $userid = "root";
my $password = "";

my $dbh = DBI->connect($dsn, $userid, $password ) or die $DBI::errstr;


my $q = CGI->new;

#Decision block which processes request as per conditions
#if no parameters renders index.html page
#if request is get with parameters it will fetch appointment details from the database
#else the request is form submission which will insert new appointment in the database
if (! $q->param()) {
    render_html($q);
} elsif('GET' eq $q->request_method && $q->param()) {
    fetch_app_details($q);

}else{
     insert_app_details($q);

}

#Function renders index.html page
sub render_html{
    my ($q) = @_;
    print "Location:index.html\n\n";
}

#Function fetches appointment details from the database
sub fetch_app_details{
    my ($q) = @_;

    my $searchstring = " ";
    my $sth;
    if($q->param("search")){
        $searchstring = $q->param("search");
         $sth= $dbh->prepare("select * from appointment where description like ?");
        $sth->execute("%".$searchstring."%") or die $DBI::errstr;

    }else{
        $sth = $dbh->prepare("select * from appointment");
        $sth->execute() or die $DBI::errstr;
    }


    my @loop_data;
    print $q->header('application/json');
    while (my $hashref = $sth->fetchrow_hashref())
    {
        push(@loop_data, $hashref);
    }

    my $json;
    $json->{"entries"} = \@loop_data;

    my $json_text = to_json(\@loop_data);
    print $json_text;

}

#Function inserts new appointment details in the database
sub insert_app_details{
    my ($q) = @_;
    my $time = $q->param("time").":00";
    my $datetimestring  = join(" ",$q->param("date"),$time);
    my $description  = $q->param("description");

    my $sth = $dbh->prepare("INSERT INTO appointment
                       (date,description)
                        values
                       (?,?)");

    $sth->execute($datetimestring,$description)
        or die $DBI::errstr;
    $sth->finish();
    render_html();
}