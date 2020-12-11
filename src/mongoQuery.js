db.notes.aggregate(
    [
        {
            $match: {
                user: ObjectId("5ed396369bc8eac9dfea039d")
            }
        },
        {
            $lookup: {
                from:'users',
                localField:'user',
                foreignField:'_id',
                as:'Supermarkets'
            }
        }
    ]
).pretty()