const collegeTotalTuitionFee = (_id) => {
  return CollegeTuitionPlan.aggregate([
    {
      $match: {
        _id: ObjectId(_id),
      },
    },
    {
      $lookup: {
        from: "paymentgroups",
        let: { paymentgroups_id: "$paymentGroupId" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$paymentgroups_id"] },
            },
          },
          {
            $lookup: {
              from: "fees",
              let: { fee_id: "$feeId" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$fee_id"] },
                  },
                },
              ],
              as: "feeDetails",
            },
          },
          {
            $project: {
              name: 1,
              feeId: 1,
              Amount: 1,
              feeType: { $arrayElemAt: ["$feeDetails.name", 0] },
            },
          },
          {
            $group: {
              _id: null,
              totalTuitionFee: {
                $sum: "$Amount",
              },
            },
          },
        ],
        as: "totalTuition",
      },
    },
    {
      $project: {
        fee: "$totalTuition.totalTuitionFee",
      },
    },
  ]);
};

const collegeTotalPaymentDues = (ids) => {
  return CollegeIrregularPaymentDueDate.aggregate([
    {
      $match: {
        $expr: { $in: ["$_id", ids] },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: "$amount",
        },
      },
    },
  ]);
};