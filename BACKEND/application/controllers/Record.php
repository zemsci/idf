<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Record extends CI_Controller {

    /**
     * Index Page for this controller.
     *
     * Maps to the following URL
     * 		http://example.com/index.php/welcome
     * 	- or -
     * 		http://example.com/index.php/welcome/index
     * 	- or -
     * Since this controller is set as the default controller in
     * config/routes.php, it's displayed at http://example.com/
     *
     * So any other public methods not prefixed with an underscore will
     * map to /index.php/welcome/<method_name>
     * @see http://codeigniter.com/user_guide/general/urls.html
     */
    public function index() {
        $this->load->view('welcome_message');
    }

    public function add($Table, $CheckField) {
        $_REQUEST = json_decode(file_get_contents('php://input'), true);
        $Fields = $this->db->list_fields($Table);
        $data = array();
        foreach (array_keys($_REQUEST) as $Req) {

            if (in_array($Req, $Fields)) {
                $data[$Req] = $_REQUEST[$Req];
            }
        }

        $this->db->where($CheckField, $data[$CheckField]);
        if ($this->db->count_all_results($Table) == 0) {
            $this->db->insert($Table, $data);
        } else {
            $this->db->where($CheckField, $data[$CheckField]);
            $this->db->update($Table, $data);
        }
        echo "OK";
    }

    public function getlist($table) {
    
        $_REQUEST = json_decode(file_get_contents('php://input'), true);
        $count_all = $this->db->count_all_results($table);

        $this->db->start_cache();
        if (isset($_REQUEST["filter"]) && $_REQUEST["filter"] != "") {
            $filter = $_REQUEST["filter"];
            foreach ($filter as $value) {
                $this->db->where($value['field'], $value['value']);
            }
        }
        if (isset($_REQUEST["search"]) && $_REQUEST["search"] != "") {
            $search = $_REQUEST["search"];
            foreach ($search as $value) {
                $this->db->or_like($value['field'], $value['value']);
            }
        }
        if (isset($_REQUEST["in"]) && $_REQUEST["in"] != "") {
            $in = json_decode($_REQUEST["in"]);
            $this->db->where_in($in['field'], $In['data']);
        }
        $this->db->from($table);
        if (isset($_REQUEST["join"]) && $_REQUEST["join"] != "") {
            $join = json_decode($_REQUEST["join"]);
            foreach ($join as $value) {
                $this->db->join($value['table'], $value['condition'], $value['type']);
            }
        }

        if (isset($_REQUEST["sort"]) && $_REQUEST["sort"] != "") {
            $sort = json_decode($_REQUEST["sort"]);
            foreach ($sort as $value) {
                $this->db->order_by($value['field'], $value['type']);
            }
        }

        $this->db->stop_cache();
        $count = $this->db->count_all_results($table);
        $query = $this->db->get();
        $data = $query->result();
        
        $result = array(
            "count_all" => $count_all,
            "count" => $count,
            "data" => $data,
            "command"=>$this->db->get_compiled_select()
        );
        echo json_encode($result);
    }

    public function delete($table) {
        $_REQUEST = json_decode(file_get_contents('php://input'), true);
        if (isset($_REQUEST['filter'])) {
            foreach ($_REQUEST['filter'] as $value) {
                $this->db->where($value['field'], $value['value']);
            }
        }

        $this->db->delete($table);
        echo "OK";
    }

}
