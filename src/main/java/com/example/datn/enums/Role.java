package com.example.datn.enums;


import com.fasterxml.jackson.annotation.JsonProperty;

public enum Role {
    @JsonProperty("admin")
    ADMIN,//0

    @JsonProperty("employee")
    EMPLOYEE,//1

    @JsonProperty("customer")
    CUSTOMER//2
}
