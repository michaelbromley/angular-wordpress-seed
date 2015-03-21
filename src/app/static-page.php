<?php
/**
 * This file creates a static page for crawlers such as Facebook or Twitter bots that cannot evaluate JavaScript.
 *
 * For a full explanation see https://github.com/michaelbromley/angular-social-demo
 */

$API_URL = "%%API_URL%%";
$SITE_URL = "%%SITE_URL%%";


$jsonData = getData($API_URL);
makePage($jsonData, $API_URL);


function getData($API_URL) {
    $id = ctype_digit($_GET['id']) ? $_GET['id'] : 1;
    $rawData = file_get_contents($API_URL.'posts/'.$id);
    return json_decode($rawData);
}

function makePage($data) {
    $pageUrl = str_replace("/api/", "/blog/", $data->link);
    $metaDescription = substr(strip_tags($data->excerpt), 0, 155);
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title><?php echo $data->title; ?></title>
        <meta property="description" content="<?php echo $metaDescription; ?>" />

        <!-- Twitter summary card metadata -->
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content="<?php echo $data->title; ?>" />
        <meta property="twitter:description" content="<?php echo strip_tags($data->excerpt); ?>" />
        <meta property="twitter:url" content="<?php echo $pageUrl; ?>" />
        <?php if (isset($data->featured_image)) {
            ?>
            <meta property="twitter:image" content="<?php echo $data->featured_image->source; ?>" />
        <?php
        }?>

        <!-- Facebook, Pinterest, Google Plus and others make use of open graph metadata -->
        <meta property="og:title" content="<?php echo $data->title; ?>" />
        <meta property="og:description" content="<?php echo strip_tags($data->excerpt); ?>" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="<?php echo $pageUrl; ?>" />
        <?php if (isset($data->featured_image)) {
            ?>
            <meta property="og:image" content="<?php echo $data->featured_image->source; ?>" />
        <?php
        }?>
        <!-- inject:css -->
        <!-- endinject -->

    </head>
    <body>
    <div class="main">

        <h2><a href="%%SITE_URL%%blog">Back to Blog</a></h2>
        <h1 class="page-header"><?php echo $data->title; ?></h1>
        <div class="pure-g page-content">
            <div class="pure-u-1">
                <div class="post-body">
                    <?php echo $data->content; ?>
                </div>
            </div>
        </div>

    </div>
    </body>
    </html>
<?php
}