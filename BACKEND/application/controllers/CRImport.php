<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class CRImport extends CI_Controller {

    var $fields;/** columns names retrieved after parsing */
    var $separator = ',';/** separator used to explode each line */
    var $enclosure = '"';/** enclosure used to decorate each field */
    var $max_row_size = 4096;/** maximum row size to be used for decoding */

    function ImportCompany() {
        ini_set('max_execution_time', 30000);
        $table = "companies";
        $p_Filepath = "./import/company.csv";
        $file = fopen($p_Filepath, 'r');
        $this->fields = fgetcsv($file, $this->max_row_size, $this->separator, $this->enclosure);
        //$keys_values = explode(',', $this->fields[0]);
        $keys_values = $this->fields;
        $content = array();
        $keys = $this->escape_string($keys_values);
        $Fields = $this->db->list_fields($table);
        // print_r($Fields);
        $i = 1;

        while (($row = fgetcsv($file, $this->max_row_size, $this->separator, $this->enclosure)) != false) {
            if ($row != null) { // skip empty lines
                //     $values = explode(',', $row[0]);
                $values = $row;
                $phone_arr = "";
                $fax_arr = "";
                if (count($keys) == count($values)) {
                    $arr = array();
                    $new_values = array();
                    $new_values = $this->escape_string($values);


                    for ($j = 0; $j < count($keys); $j++) {
                        if ($keys[$j] != "") {
                            $data = array();


                            if (in_array($keys[$j], $Fields)) {
                                $arr[$keys[$j]] = iconv("TIS-620", "UTF-8", $new_values[$j]);
                                if ($arr[$keys[$j]] == "0") {
                                    $arr[$keys[$j]] = $new_values[$j];
                                }
                            }

                            if ($keys[$j] == "PHONE") {
                                $phone_arr = $new_values[$j];
                                if (trim($phone_arr) != "") {

                                    $phone_arr = explode(',', $phone_arr);
                                    $phone_i = 1;
                                    foreach ($phone_arr as $phone) {
                                        if ($phone_i <= 2) {
                                            $phone = trim($phone);
                                            $arr['PHONE' . $phone_i] = $phone;
                                            $phone_i++;
                                        }
                                    }
                                }
                            }
                            if ($keys[$j] == "FAX") {
                                $phone_arr = $new_values[$j];
                                if (trim($phone_arr) != "") {

                                    $phone_arr = explode(',', $phone_arr);
                                    $fax_i = 1;
                                    foreach ($phone_arr as $phone) {
                                        if ($fax_i <= 2) {
                                            $phone = trim($phone);
                                            $arr['FAX' . $fax_i] = $phone;
                                            $fax_i++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    $this->db->where("NAME", $arr["NAME"]);
                    if ($this->db->count_all_results($table) == 0) {
                        $this->db->insert($table, $arr);
                    } else {
                        $this->db->where("NAME", $arr["NAME"]);
                        $this->db->update($table, $arr);
                    }
                    $industry_arr = explode(',', $arr["INDUSTRY"]);
                    foreach ($industry_arr as $industry) {
                        $industry = trim($industry);
                        if ($industry != "") {
                            $this->db->where("NAME", $industry);
                            if ($this->db->count_all_results('industry') == 0) {
                                $this->db->insert('industry', array("NAME" => $industry));
                            }
                        }
                    }
                    $content[$i] = $arr;
                    $i++;
                }
            }
        }
        fclose($file);
        echo "Total Import " . count($content) . " Record";
    }

    function ImportContact() {
        ini_set('max_execution_time', 30000);
        $table = "contacts";
        $p_Filepath = "./import/contact.csv";
        $file = fopen($p_Filepath, 'r');
        $this->fields = fgetcsv($file, $this->max_row_size, $this->separator, $this->enclosure);
        //$keys_values = explode(',', $this->fields[0]);
        $keys_values = $this->fields;
        $content = array();
        $keys = $this->escape_string($keys_values);
        $Fields = $this->db->list_fields($table);
        // print_r($Fields);
        $i = 1;

        while (($row = fgetcsv($file, $this->max_row_size, $this->separator, $this->enclosure)) != false) {
            if ($row != null) { // skip empty lines
                //     $values = explode(',', $row[0]);
                $values = $row;
                $phone_arr = "";
                $email_arr = "";
                if (count($keys) == count($values)) {
                    $arr = array();
                    $new_values = array();
                    $new_values = $this->escape_string($values);


                    for ($j = 0; $j < count($keys); $j++) {
                        if ($keys[$j] != "") {
                            $data = array();


                            if (in_array($keys[$j], $Fields)) {
                                $arr[$keys[$j]] = iconv("TIS-620", "UTF-8", $new_values[$j]);
                                if ($arr[$keys[$j]] == "0") {
                                    $arr[$keys[$j]] = $new_values[$j];
                                }
                            }

                            if ($keys[$j] == "EMAIL") {

                                $email_arr = $new_values[$j];
                                if (trim($email_arr) != "") {

                                    $email_arr = explode(',', $email_arr);
                                    $email_i = 1;
                                    foreach ($email_arr as $email) {
                                        if ($email_i <= 2) {
                                            $email = trim($email);
                                            $arr['EMAIL' . $email_i] = $email;
                                            $email_i++;
                                        }
                                    }
                                }
                            }
                            if ($keys[$j] == "EMAIL2") {
                                $arr['EMAIL2'] = $new_values[$j];
                            }
                            if ($keys[$j] == "DIRECT_PHONE") {
                                $phone_arr = $new_values[$j];
                                if (trim($phone_arr) != "") {

                                    $phone_arr = explode(',', $phone_arr);
                                    $phone_i = 1;
                                    $mobile_i = 1;
                                    foreach ($phone_arr as $phone) {

                                        $phone = trim($phone);
                                        if (substr($phone, 0, 2) == "08") {
                                            if ($mobile_i <= 2) {
                                                $arr['MOBILE' . $mobile_i] = $phone;
                                                $mobile_i++;
                                            }
                                        } else {
                                            if ($phone_i <= 2) {
                                                $arr['DIRECTPHONE' . $phone_i] = $phone;
                                                $phone_i++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    $this->db->where("TITLE", $arr["TITLE"]);
                    $this->db->where("FIRST_NAME", $arr["FIRST_NAME"]);
                    $this->db->where("LAST_NAME", $arr["LAST_NAME"]);
                    $this->db->where("COMPANY", $arr["COMPANY"]);
                    if ($this->db->count_all_results($table) == 0) {
                        $this->db->insert($table, $arr);
                    } else {
                        $this->db->where("TITLE", $arr["TITLE"]);
                        $this->db->where("FIRST_NAME", $arr["FIRST_NAME"]);
                        $this->db->where("LAST_NAME", $arr["LAST_NAME"]);
                        $this->db->where("COMPANY", $arr["COMPANY"]);
                        $this->db->update($table, $arr);
                    }
                    $title_arr = explode(',', $arr["TITLE"]);
                    foreach ($title_arr as $title) {
                        $title = trim($title);
                        if ($title != "") {
                            $this->db->where("NAME", $title);
                            if ($this->db->count_all_results('title') == 0) {
                                $this->db->insert('title', array("NAME" => $title));
                            }
                        }
                    }
                    $jobtitle_arr = explode(',', $arr["JOB_TITLE"]);
                    foreach ($jobtitle_arr as $jobtitle) {
                        $jobtitle = trim($jobtitle);
                        if ($jobtitle != "") {
                            $this->db->where("NAME", $jobtitle);
                            if ($this->db->count_all_results('jobtitle') == 0) {
                                $this->db->insert('jobtitle', array("NAME" => $jobtitle));
                            }
                        }
                    }
                    $department_arr = explode(',', $arr["DEPARTMENT"]);
                    foreach ($department_arr as $department) {
                        $department = trim($department);
                        if ($department != "") {
                            $this->db->where("NAME", $department);
                            if ($this->db->count_all_results('department') == 0) {
                                $this->db->insert('department', array("NAME" => $department));
                            }
                        }
                    }
                }
                $content[$i] = $arr;
                $i++;
            }
        }

        fclose($file);
        echo "Total Import " . count($content) . " Record";
    }

    function escape_string($data) {
        $result = array();
        foreach ($data as $row) {
            $result[] = str_replace('"', '', $row);
        }
        return $result;
    }

    function do_upload() {
        $file_name = $_REQUEST["file_name"];
        if (!empty($_FILES)) {
            $ext = explode('.', $_FILES['file']['name']);
            $ext = $ext[1];
            if ($ext != 'csv') {
                echo "Filt must be csv";
                return;
            }
            $tempPath = $_FILES['file']['tmp_name'];
            // $uploadPath = dirname($_SERVER["SCRIPT_FILENAME"]) . DIRECTORY_SEPARATOR . 'import' . DIRECTORY_SEPARATOR . $_FILES['file']['name'];
            $uploadPath = dirname($_SERVER["SCRIPT_FILENAME"]) . DIRECTORY_SEPARATOR . 'import' . DIRECTORY_SEPARATOR . $file_name . "." . $ext;
            move_uploaded_file($tempPath, $uploadPath);

            $answer = array('answer' => 'File transfer completed');
            $json = json_encode($answer);

            echo $json;
        } else {

            echo 'No files';
        }
    }

}

?> 