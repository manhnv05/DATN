package com.example.datn.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Gender {
    @JsonProperty("male")

    MALE,//0
    @JsonProperty("female")
    FEMALE,//1

}
