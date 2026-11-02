package com.vms.dto;

/**
 * Data Transfer Object representing aggregate counts for the live dashboard cards.
 */
public class DashboardStatsDTO {

    private long totalVisitors;
    private long checkedIn;
    private long checkedOut;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(long totalVisitors, long checkedIn, long checkedOut) {
        this.totalVisitors = totalVisitors;
        this.checkedIn = checkedIn;
        this.checkedOut = checkedOut;
    }

    public long getTotalVisitors() {
        return totalVisitors;
    }

    public void setTotalVisitors(long totalVisitors) {
        this.totalVisitors = totalVisitors;
    }

    public long getCheckedIn() {
        return checkedIn;
    }

    public void setCheckedIn(long checkedIn) {
        this.checkedIn = checkedIn;
    }

    public long getCheckedOut() {
        return checkedOut;
    }

    public void setCheckedOut(long checkedOut) {
        this.checkedOut = checkedOut;
    }
}
