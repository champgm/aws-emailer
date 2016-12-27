<?php


foreach($labels as $label){
    print "
<div class=\"row\">
    <div class=\"col-xs-4 col-xs-offset-4\">
        <div class=\"radio\">
            <label><input type=\"radio\" name=\"label\" value=\"{$label}\">{$label}</label>
        </div>
    </div>
</div>";
}

?>