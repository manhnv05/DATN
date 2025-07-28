package com.example.datn.DTO.page;



import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@Builder
public class PaginationInfoResponse {
    int pageNo;
    int pageSize;
    long totalElements;
    int totalPages;
    String sortBy;
    String sortDir;
}
